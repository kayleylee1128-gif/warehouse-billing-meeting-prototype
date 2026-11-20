let esbuild;try{esbuild=require('esbuild')}catch{esbuild=require('../warehouse-performance-review/node_modules/esbuild')}
const fs=require('fs'),crypto=require('crypto');
fs.mkdirSync('docs',{recursive:true});
const options={bundle:true,minify:true,target:['chrome80'],supported:{'destructuring':true},logLevel:'silent',loader:{'.jsx':'jsx'},nodePaths:['../warehouse-performance-review/node_modules'],banner:{js:fs.readFileSync('browser-compat.js','utf8')},define:{'process.env.NODE_ENV':'"production"'}};
const hash=f=>crypto.createHash('sha256').update(fs.readFileSync('docs/'+f)).digest('hex').slice(0,10);
const guard=fs.readFileSync('load-guard.js','utf8');
function html(title,styles,script){return '<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+title+'</title>'+styles.map(f=>'<link rel="stylesheet" href="./'+f+'?v='+hash(f)+'">').join('')+'</head><body><div id="root"><p style="margin:60px;font:15px Microsoft YaHei,sans-serif;color:#64748b">正在加载原型…</p></div><script>'+guard+'</script><script src="./'+script+'?v='+hash(script)+'" onerror="showPrototypeLoadError(\'核心脚本下载失败，请检查网络后重试。\')"></script></body></html>'}
esbuild.buildSync({...options,entryPoints:['app.jsx'],outfile:'docs/app.js'});fs.copyFileSync('style.css','docs/style.css');fs.writeFileSync('docs/index.html',html('计费配置管理 · 会议评审版',['style.css'],'app.js'));fs.writeFileSync('docs/.nojekyll','');
esbuild.buildSync({...options,entryPoints:['warehouse-fees.jsx'],outfile:'docs/warehouse-fees.js'});for(const css of ['fees-base.css','monthly-fees.css'])fs.copyFileSync(css,'docs/'+css);fs.writeFileSync('docs/fees.html',html('仓库费用统计',['fees-base.css','monthly-fees.css'],'warehouse-fees.js'));
