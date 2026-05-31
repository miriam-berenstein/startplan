import { PageHeader } from '../../shared/ui/PageHeader';
import { Card } from '../../shared/ui/Card';
import { useMasterProStore } from '../../app/store/useMasterProStore';
export function WarningsScreen(){ const warnings=useMasterProStore(s=>s.warnings); return <><PageHeader title='מרכז אזהרות' description='כל פער או כשל מימון מוצג בגלוי — אין false success.'/><div className='grid'>{warnings.length?warnings.map(w=><Card key={w.id} className={w.severity==='critical'?'critical-card':''}><h3>{w.title}</h3><p>{w.message}</p><small>חודש: {w.month ?? '—'} | חומרה: {w.severity}</small></Card>):<Card>אין אזהרות פעילות. יש להריץ סימולציה כדי לעדכן.</Card>}</div></> }
