import { Button } from '../../shared/ui/Button';
import { Card } from '../../shared/ui/Card';
import { PageHeader } from '../../shared/ui/PageHeader';
import { useMasterProStore } from '../../app/store/useMasterProStore';
import { formatMoney } from '../../shared/utils/money';
export function ControlCenterScreen(){
 const route=useMasterProStore(s=>s.routes[s.selectedRouteId]); const snapshot=useMasterProStore(s=>s.simulationSnapshots[s.selectedRouteId]); const warnings=useMasterProStore(s=>s.warnings); const recs=useMasterProStore(s=>s.recommendations); const run=useMasterProStore(s=>s.actions.runSimulation); const go=useMasterProStore(s=>s.actions.selectScreen);
 return <><PageHeader title='מסך שליטה מרכזי' description='תמונת מצב מקצועית: מסלול פעיל, כיסוי אירועים, סיכונים ופעולות נדרשות.' actions={<div className='action-rows'><Button data-qa='run-simulation' onClick={run}>הרץ סימולציה</Button><Button onClick={()=>go('routes')}>מסלולים</Button><Button onClick={()=>go('reports')}>יצוא</Button></div>}/>
 <div className='grid cards-4'>
  <Card><span className='eyebrow'>מסלול פעיל</span><h2>{route.name}</h2><p>{route.explanation}</p></Card>
  <Card><span className='eyebrow'>יתרה צפויה</span><h2>{snapshot ? formatMoney(snapshot.totals.endingBalance) : 'טרם הורצה'}</h2><p>מבוסס Snapshot של המסלול הנוכחי.</p></Card>
  <Card><span className='eyebrow'>אזהרות</span><h2 className={warnings.length?'danger':''}>{warnings.length}</h2><p>{warnings.length?'יש נקודות לטיפול':'אין אזהרות קריטיות כרגע'}</p></Card>
  <Card><span className='eyebrow'>המלצות</span><h2>{recs.length}</h2><p>המלצות הן הצעה בלבד ודורשות אישור.</p></Card>
 </div>
 <div className='grid cards-2 top-gap'><Card><h3>פעולות מומלצות</h3><ol className='clean-list'><li>הרץ סימולציה לאחר שינוי נתונים.</li><li>שמור Snapshot להשוואה לפני שינוי מהותי.</li><li>בדוק אזהרות והמלצות לפני Export.</li></ol></Card><Card><h3>איכות תכנית</h3><p>המערכת בודקת פערי מימון, State, כפתורים, Export ו־QA לפני סגירה.</p><div className='status-line'><span>QA Gate</span><b>{snapshot?'פעיל':'ממתין לסימולציה'}</b></div></Card></div></>;
}
