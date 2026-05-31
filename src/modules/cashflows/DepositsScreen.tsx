import { PageHeader } from '../../shared/ui/PageHeader';
import { Card } from '../../shared/ui/Card';
import { Button } from '../../shared/ui/Button';
import { useMasterProStore } from '../../app/store/useMasterProStore';
import { formatMoney } from '../../shared/utils/money';
export function DepositsScreen(){ const route=useMasterProStore(s=>s.routes[s.selectedRouteId]); const update=useMasterProStore(s=>s.actions.updateDeposit); const run=useMasterProStore(s=>s.actions.runSimulation); return <><PageHeader title='הפקדות' description='ניהול הפקדה לפי מסלול: קבוע, מדורג או מודל הפוך.' actions={<div className='action-rows'><Button onClick={run}>עדכן והרץ סימולציה</Button></div>}/><Card><label className='big-input'>הפקדה חודשית למסלול {route.name}<input type='number' value={route.deposits.monthlyDeposit} onChange={e=>update(route.id,Number(e.target.value))}/></label><p>סכום נוכחי: <b>{formatMoney(route.deposits.monthlyDeposit)}</b></p></Card><Card><h3>מדיניות הפקדות</h3><p>כל שינוי נשמר למסלול הפעיל בלבד. שינוי מהותי ניתן לשכפל למסלול חדש להשוואה.</p></Card></> }
