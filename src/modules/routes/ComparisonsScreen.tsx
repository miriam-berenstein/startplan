import { PageHeader } from '../../shared/ui/PageHeader';
import { Button } from '../../shared/ui/Button';
import { Card } from '../../shared/ui/Card';
import { useMasterProStore } from '../../app/store/useMasterProStore';
import { formatMoney } from '../../shared/utils/money';
export function ComparisonsScreen(){ const save=useMasterProStore(s=>s.actions.saveComparisonSnapshot); const comparisons=useMasterProStore(s=>s.comparisons); const snapshots=useMasterProStore(s=>s.simulationSnapshots); return <><PageHeader title='השוואות' description='השוואה נקייה מתוך Snapshots נפרדים לכל מסלול — לא State חי שיכול להתבלבל.' actions={<Button onClick={save}>רענן השוואה</Button>}/>{Object.keys(snapshots).length===0&&<Card>יש להריץ סימולציה לפחות למסלול אחד.</Card>}<div className='grid cards-3'>{comparisons.map(c=><Card key={c.routeId}><h3>{c.name}</h3><p>יתרה: <b>{formatMoney(c.endingBalance)}</b></p><p>פערים: <b>{formatMoney(c.deficits)}</b></p><p>מינוף: <b>{formatMoney(c.leverage)}</b></p><p>אזהרות: {c.warnings}</p></Card>)}</div></>}
