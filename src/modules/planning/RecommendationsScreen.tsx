import { PageHeader } from '../../shared/ui/PageHeader';
import { Card } from '../../shared/ui/Card';
import { Button } from '../../shared/ui/Button';
import { useMasterProStore } from '../../app/store/useMasterProStore';
export function RecommendationsScreen(){ const recs=useMasterProStore(s=>s.recommendations); const accept=useMasterProStore(s=>s.actions.acceptRecommendation); const run=useMasterProStore(s=>s.actions.runSimulation); return <><PageHeader title='המלצות' description='המלצות הן הצעה בלבד. יישום המלצה דורש פעולה מפורשת ואז סימולציה חוזרת.' actions={<Button onClick={run}>רענן המלצות</Button>}/><div className='grid cards-2'>{recs.map(r=><Card key={r.id}><span className='eyebrow'>Action Optimizer בסיסי</span><h3>{r.title}</h3><p>{r.impact}</p><Button onClick={()=>accept(r.id)}>קבל והרץ סימולציה</Button></Card>)}{!recs.length && <Card>אין המלצות פעילות כרגע. אם קיימים פערים, הרץ סימולציה כדי לעדכן.</Card>}</div></> }
