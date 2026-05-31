import { PageHeader } from '../../shared/ui/PageHeader';
import { Card } from '../../shared/ui/Card';
import { useMasterProStore } from '../../app/store/useMasterProStore';
import { formatMoney } from '../../shared/utils/money';
export function AgentDashboardScreen(){ const s=useMasterProStore(); const snap=s.simulationSnapshots[s.selectedRouteId]; return <><PageHeader title='דשבורד סוכן PRO' description='מבט מנהלים קצר ונקי להצגה מקצועית.'/><div className='grid cards-4'><Card><span className='eyebrow'>לקוח</span><h2>{s.client.numberOfChildren} אירועים</h2></Card><Card><span className='eyebrow'>מסלול</span><h2>{s.routes[s.selectedRouteId].name}</h2></Card><Card><span className='eyebrow'>יתרה</span><h2>{snap?formatMoney(snap.totals.endingBalance):'—'}</h2></Card><Card><span className='eyebrow'>Release QA</span><h2>{s.qa.releaseBlocked?'חסום':'ירוק'}</h2></Card></div></>}
