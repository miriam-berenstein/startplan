import { useState } from 'react';
import { PageHeader } from '../../shared/ui/PageHeader';
import { Button } from '../../shared/ui/Button';
import { useMasterProStore } from '../../app/store/useMasterProStore';
import type { MonthlySimulationRow } from '../../shared/types/domain';

export function SimulationScreen(){
  const run=useMasterProStore(s=>s.actions.runSimulation);
  const snapshot=useMasterProStore(s=>s.simulationSnapshots[s.selectedRouteId]);
  const rows=snapshot?.rows.filter((_,i)=>i<240) ?? [];
  const [selectedRow,setSelectedRow]=useState<MonthlySimulationRow|null>(null);
  return <>
    <PageHeader title='סימולציה חודשית' description='טבלה נקייה ומהירה; משיכה, מינוף ומס מוסברים בכפתור פירוט מקצועי ללא פתיחת שורות בתוך הטבלה.' actions={<Button data-qa='run-simulation' onClick={run}>הרץ סימולציה</Button>}/>
    <div className='table-wrap tall' data-qa='simulation-table'><table><thead><tr><th>חודש</th><th>יתרה פתיחה</th><th>הפקדה</th><th>תשואה</th><th>דמי ניהול</th><th>משיכה</th><th>יתרה סגירה</th><th>פירוט</th></tr></thead><tbody>{rows.map(r=><tr key={r.month} className={r.liquidityStatus}><td>{r.month}</td><td>{Math.round(r.openingBalance).toLocaleString('he-IL')}</td><td>{r.regularDeposit.toLocaleString('he-IL')}</td><td>{Math.round(r.returnAmount).toLocaleString('he-IL')}</td><td>{Math.round(r.managementFee).toLocaleString('he-IL')}</td><td>{Math.round(r.eventWithdrawal).toLocaleString('he-IL')}</td><td>{Math.round(r.closingBalance).toLocaleString('he-IL')}</td><td>{r.actionDetails?.length ? <button className='link-button' onClick={()=>setSelectedRow(r)}>פירוט</button> : '—'}</td></tr>)}</tbody></table></div>
    {selectedRow && <div className='drawer-backdrop' role='dialog' aria-modal='true' onClick={()=>setSelectedRow(null)}><aside className='action-drawer' onClick={e=>e.stopPropagation()}><div className='drawer-header'><div><h2>פירוט פעולה — חודש {selectedRow.month}</h2><p>הסבר מקצועי למה בוצעה הפעולה, כמה בוצע, ואילו כללים הופעלו.</p></div><button className='link-button' onClick={()=>setSelectedRow(null)}>סגור</button></div>{selectedRow.actionDetails?.map((d,i)=><section className='detail-card' key={i}><strong>{d.title}</strong>{typeof d.amount==='number' && <span>{Math.round(d.amount).toLocaleString('he-IL')} ₪</span>}<p>{d.explanation}</p><small>כללים: {d.ruleIds.join(', ')}</small></section>)}<section className='detail-card'><strong>השפעה על נזילות</strong><p>סטטוס החודש: {selectedRow.liquidityStatus==='ok'?'תקין':selectedRow.liquidityStatus==='warning'?'אזהרה':'כשל מימון'}. יתרת סגירה: {Math.round(selectedRow.closingBalance).toLocaleString('he-IL')} ₪.</p></section></aside></div>}
  </>
}
