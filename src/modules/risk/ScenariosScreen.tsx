import { PageHeader } from '../../shared/ui/PageHeader';
import { Card } from '../../shared/ui/Card';
import { useMasterProStore } from '../../app/store/useMasterProStore';
import { formatPercent } from '../../shared/utils/money';
export function ScenariosScreen(){ const scenarios=useMasterProStore(s=>s.scenarios); return <><PageHeader title='תרחישים' description='רגיל / שפל / גאות / Stress — כל תרחיש חייב לייצר תוצאה שונה.'/><div className='grid cards-4'>{Object.values(scenarios).map(sc=><Card key={sc.id}><h3>{sc.name}</h3><p>תשואה שנתית: <b>{formatPercent(sc.annualReturn)}</b></p><p>{sc.stressLoss?'Stress loss: '+formatPercent(sc.stressLoss):'תרחיש בסיס'}</p></Card>)}</div></>}
