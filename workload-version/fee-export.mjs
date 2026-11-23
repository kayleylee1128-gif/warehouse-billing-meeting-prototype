export {csv,downloadCsv} from './legacy-fee-export.mjs';
import {csv} from './legacy-fee-export.mjs';
import {nodes} from './fees-model.mjs';
export function summaryExport(w,group,rows){return csv(['仓库','月份',group==='node'?'节点':'员工','完成单量','总工作量','费用','币种'],rows.map(r=>[w.name,w.month,group==='node'?nodes[r.id]:r.id,r.docCount,+r.charges.reduce((n,c)=>n+c.workload,0).toFixed(4),(r.cents/100).toFixed(2),w.currency]))}
export function detailExport(w,rows){return csv(['仓库','月份','单据','完成时间','员工','节点','库位数','款数','件数','每库位工作量','每款工作量','每件工作量','总工作量','工作量单价','版本','匹配条件','计算公式','费用','币种'],rows.map(c=>[w.name,w.month,c.doc,c.completedAt,c.person,nodes[c.node],c.locations??'',c.styles,c.items,c.coefficients.locations??'',c.coefficients.styles,c.coefficients.items,c.workload,c.workloadRate,'V'+c.version,c.matched,c.formula,(c.cents/100).toFixed(2),w.currency]))}
