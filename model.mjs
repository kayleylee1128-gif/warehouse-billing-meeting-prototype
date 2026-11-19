export const nodes=[
{id:'receive',name:'收货',group:'入库',units:['箱数（包裹数）','入库单'],conditions:['箱数']},
{id:'qc',name:'质检',group:'入库',units:['实际抽检件数','质检款数'],conditions:['品类与抽检数量','单件实重','单件体积']},
{id:'label',name:'贴标',group:'入库',units:['件'],conditions:['单件实重','单件体积']},
{id:'putaway',name:'上架',group:'入库',units:['库位','件','款'],conditions:['单件实重','单件体积','单件最长边','单件三边和']},
{id:'returns',name:'退件处理',group:'入库',units:['箱数（包裹数）','退件单','件'],conditions:['单件实重','退件类型']},
{id:'pick',name:'拣货',group:'出库',units:['库位','件','款'],conditions:['单件实重','单件体积','单件最长边','单件三边和']},
{id:'pack',name:'打包',group:'出库',units:['打包单','包裹','件','款'],conditions:['单内件数','单内款数','单内商品最大实重','单内商品最大体积','单内商品最长边最大值']},
{id:'scan',name:'扫描',group:'出库',units:['包裹'],conditions:[]},
{id:'dispatch',name:'出库',group:'出库',units:['交运袋','包裹','出库单'],conditions:['袋内包裹数','单内件数','单内款数','包裹实重','包裹体积']},
{id:'count',name:'盘点',group:'库内作业',units:['实盘库位','实盘件数','实盘款数'],conditions:[]}
];
export const clone=x=>JSON.parse(JSON.stringify(x));
export function conditionsFor(r){const n=nodes.find(n=>n.id===r.id);return r.id==='receive'?(r.unit==='入库单'?[]:['箱数']):r.id==='qc'&&r.unit==='质检款数'?['品类与质检款数','单件实重','单件体积']:n.conditions}
export function directRule(rule){const r={...rule};const n=nodes.find(n=>n.id===r.id);const opts=conditionsFor(r);if(r.method==='基础费＋续件费'||!opts.length)return {...r,condition:'不分档',bands:[]};if(!opts.includes(r.condition))r.condition=opts[0];if(!r.bands?.length){const count=/数|箱数/.test(r.condition);r.bands=[{min:count?1:0,max:count?10:1,price:r.price,category:r.condition==='退件类型'?'客户退件':'日用百货'}]}return r}
export const fresh=id=>directRule({id,unit:nodes.find(n=>n.id===id).units[0],price:id==='receive'?0.25:0.1,condition:'不分档',bands:[],method:'按量计费',base:1,included:1,next:0.1});
export const directData=data=>data.map(w=>({...w,versions:w.versions.map(v=>({...v,rules:v.rules.map(directRule)}))}));
export function validate(r){if(r.price===null||!Number.isFinite(r.price)||r.price<0)return '请填写非负默认单价';if(r.method==='基础费＋续件费'&&(r.base===null||r.base<0||!Number.isInteger(r.included)||r.included<1||r.next===null||r.next<0))return '请填写有效基础费、包含数量和续件费';if(r.condition==='不分档')return '';if(!r.bands.length)return '请至少填写一行价格';let prev={};for(const b of r.bands){const key=['品类与抽检数量','品类与质检款数'].includes(r.condition)?b.category:'all';if(!key)return '请选择每行品类';if(b.price===null||!Number.isFinite(b.price)||b.price<0)return '请填写每行单价';if(b.min===null||b.min<0||b.max===null||b.max<b.min)return '请填写有效区间';const count=/数|箱数/.test(r.condition);if(r.condition==='退件类型'){if(!b.category)return '请填写退件类型';if(prev[b.category])return '退件类型不能重复';prev[b.category]=true;continue}if(count&&(!Number.isInteger(b.min)||!Number.isInteger(b.max)||b.min<1))return '数量区间须为正整数';if(prev[key]!==undefined&&(count?b.min!==prev[key]+1:b.min!==prev[key]))return count?'同一品类的数量范围须连续且不重叠':'属性范围须连续且不重叠';if(count&&prev[key]===undefined&&b.min!==1)return '数量范围从1开始';prev[key]=b.max;}return '';}
export function calculate(r,q,attribute=q,category='日用百货'){if(!(q>0))return 0;if(r.method==='基础费＋续件费')return +(r.base+Math.max(0,q-r.included)*r.next).toFixed(2);const count=/数|箱数/.test(r.condition);const b=r.bands.find(b=>r.condition==='退件类型'?b.category===category:(!['品类与抽检数量','品类与质检款数'].includes(r.condition)||b.category===category)&&(count?attribute>=b.min:attribute>b.min)&&attribute<=b.max);return +(q*(r.condition!=='不分档'&&b?b.price:r.price)).toFixed(2);}
export const initial=()=>[{id:'demo-a',name:'示例一号仓',code:'DEMO-001',versions:[{v:1,audit:'已通过',status:'生效中',date:'2026-11-01',rules:['receive','qc','pick'].map(fresh),created:'2026-10-29 10:00',updated:'2026-10-30 16:00',author:'示例配置员',logs:['示例配置员创建V1','提交钉钉审批（演示）','示例审核员审批通过']},{v:2,audit:'审批中',status:'未生效',date:'2026-11-20',rules:['receive','qc','pick'].map(fresh),created:'2026-11-18 10:00',updated:'2026-11-18 16:00',author:'示例配置员',logs:['基于V1创建V2','示例配置员提交钉钉审批（演示）']}]},{id:'demo-b',name:'示例二号仓',code:'DEMO-002',versions:[]}];

export function rollover(data,today=new Date().toLocaleDateString('sv-SE')){return data.map(w=>{const eligible=w.versions.filter(v=>v.audit==='已通过'&&v.date<=today).sort((a,b)=>b.date.localeCompare(a.date)||b.v-a.v);return {...w,versions:w.versions.map(v=>({...v,status:v.audit!=='已通过'?'未生效':v.date>today?'待生效':eligible[0]?.v===v.v?'生效中':'已失效'}))}})}
