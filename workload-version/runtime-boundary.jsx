import React from'react';
export class RuntimeBoundary extends React.Component{
 constructor(props){super(props);this.state={error:null}}
 static getDerivedStateFromError(error){return {error:String(error&&error.message||error)}}
 render(){if(!this.state.error)return this.props.children;return <div className="config-app" style={{display:'block',padding:40}}><section style={{maxWidth:680,margin:'40px auto',background:'#fff',padding:28,border:'1px solid #dbe3ed',borderRadius:8}}><h2>页面运行遇到错误</h2><p>已保存的数据会保留。请重新加载；若仍报错，请将以下信息发给原型维护人。</p><pre style={{whiteSpace:'pre-wrap',overflowWrap:'anywhere',color:'#64748b'}}>{this.state.error}</pre><button onClick={()=>location.reload()}>重新加载</button><a style={{marginLeft:16}} href="./warehouse-billing-offline.zip">下载离线原型</a></section></div>}
}
