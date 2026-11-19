import{test}from'node:test';import assert from'node:assert/strict';import{nodes,fresh,validate,calculate,initial}from'./model.mjs';
test('receiving units exclude pieces and merge parcel/box',()=>assert.deepEqual(nodes[0].units,['箱数（包裹数）','入库单']));
test('box band uses whole quantity, boundaries are inclusive',()=>{const r={...fresh('receive'),condition:'箱数',bands:[{min:1,max:10,price:2},{min:11,max:100,price:1}]};assert.equal(validate(r),'');assert.equal(calculate(r,10),20);assert.equal(calculate(r,11),11);assert.equal(calculate(r,101),25.25);r.bands[1].min=10;assert.match(validate(r),/连续/)});
test('fractional box bands fail',()=>{assert.match(validate({...fresh('receive'),condition:'箱数',bands:[{min:1,max:10.5,price:1}]}),/整数/)});
test('QC category matches one band, different category falls back',()=>{const r={...fresh('qc'),condition:'品类与抽检数量',bands:[{category:'服装鞋帽',min:1,max:10,price:2}]};assert.equal(calculate(r,5,5,'服装鞋帽'),10);assert.equal(calculate(r,5,5,'日用百货'),.5)});
test('default versions have live and pending simultaneously; one rule per node',()=>{const w=initial()[0];assert.equal(w.versions[0].status,'生效中');assert.equal(w.versions[1].audit,'审批中');for(const v of w.versions)assert.equal(new Set(v.rules.map(r=>r.id)).size,v.rules.length)});
test('base price and continuation are one formula',()=>assert.equal(calculate({...fresh('pick'),method:'基础费＋续件费',base:1,included:2,next:.1},5),1.3));

import{rollover}from'./model.mjs';
test('approval and effective date separately control active version',()=>{let w=initial();w[0].versions[1].audit='已通过';assert.equal(rollover(w,'2026-11-19')[0].versions[1].status,'待生效');const next=rollover(w,'2026-11-20')[0];assert.equal(next.versions[0].status,'已失效');assert.equal(next.versions[1].status,'生效中')});

import{directRule,calculateQc}from'./model.mjs';
test('QC charges styles and sampled items together, with independent prices',()=>{const r=fresh('qc');r.qcMatrix.rows[0].stylePrice=2;r.qcMatrix.rows[0].itemPrice=.5;assert.deepEqual(calculateQc(r,{styles:3,items:8}),{styleAmount:6,itemAmount:4,total:10});r.qcMatrix.rows[0].itemPrice=null;assert.match(validate(r),/每件价格/)});
test('QC migration retains previously maintained style price and supplies both sections',()=>{const r=directRule({id:'qc',unit:'质检款数',price:3,method:'按量计费',condition:'不分档',bands:[]});assert.equal(r.qcPrices.styles.price,3);assert.equal(r.qcPrices.styles.bands[0].price,3);assert.equal(r.qcPrices.items.unit,'实际抽检件数');assert.deepEqual(directRule(r),r)});

import{calculatePutaway}from'./model.mjs';
test('putaway combines location and item rates from the same condition row',()=>{const r=fresh('putaway');r.putawayMatrix.rows[0].locationPrice=.3;r.putawayMatrix.rows[0].itemPrice=.05;assert.deepEqual(calculatePutaway(r,{locations:2,items:6,weight:.5}),{locationAmount:.6,itemAmount:.3,total:.9});r.putawayMatrix.rows[0].itemPrice=null;assert.match(validate(r),/每件价格/)});
test('returns excludes box units and return type conditions including stored data',()=>{const n=nodes.find(n=>n.id==='returns');assert.deepEqual(n.units,['退件单','件']);assert.deepEqual(n.conditions,['单件实重']);const r=directRule({id:'returns',unit:'箱数（包裹数）',price:.2,method:'按量计费',condition:'退件类型',bands:[{category:'客户退件',min:0,max:10,price:.3}]});assert.equal(r.unit,'退件单');assert.equal(r.condition,'单件实重');assert.equal(validate(r),'')});

import{calculatePack}from'./model.mjs';
test('pack price requires every condition and selects first matching row',()=>{const r=fresh('pack');r.packMatrix={defaultPrice:.1,rows:[{conditions:[{dimension:'单内件数',min:1,max:10},{dimension:'单内款数',min:1,max:2}],price:.5},{conditions:[{dimension:'单内件数',min:1,max:10}],price:.3}]};assert.equal(validate(r),'');assert.equal(calculatePack(r,2,{'单内件数':6,'单内款数':2}),1);assert.equal(calculatePack(r,2,{'单内件数':6,'单内款数':3}),.6);assert.equal(calculatePack(r,2,{'单内件数':20,'单内款数':2}),.2);r.packMatrix.rows[0].conditions.push({dimension:'单内款数',min:1,max:3});assert.match(validate(r),/重复/)});

test('pack allows only parcels and items, including old browser records',()=>{assert.deepEqual(nodes.find(n=>n.id==='pack').units,['包裹','件']);assert.equal(fresh('pack').unit,'包裹');const r=directRule({...fresh('pack'),unit:'打包单'});assert.equal(r.unit,'包裹');assert.ok(r.packMatrix.rows.length)});
