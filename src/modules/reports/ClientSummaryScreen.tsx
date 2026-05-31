import { PageHeader } from '../../shared/ui/PageHeader';
import { Card } from '../../shared/ui/Card';
import { useMasterProStore } from '../../app/store/useMasterProStore';
import { formatMoney } from '../../shared/utils/money';
export function ClientSummaryScreen(){ const s=useMasterProStore(); const snap=s.simulationSnapshots[s.selectedRouteId]; const route=s.routes[s.selectedRouteId]; return <><PageHeader title='סיכום ללקוח' description='סיכום פשוט, לא טכני, עם מצב התוכנית והפעולה החשובה ביותר.'/><Card><h2>{route.name}</h2><p>{route.explanation}</p><p>יתרה צפויה: <b>{snap?formatMoney(snap.totals.endingBalance):'טרם הורצה סימולציה'}</b></p><p>אזהרות: <b>{snap?.warnings.length??0}</b></p><p>המלצה מרכזית: {s.recommendations[0]?.title ?? 'אין המלצה פעילה כרגע'}</p></Card></>}
