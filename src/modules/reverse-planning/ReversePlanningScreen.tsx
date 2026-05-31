import { PageHeader } from '../../shared/ui/PageHeader';
import { Card } from '../../shared/ui/Card';
import { Button } from '../../shared/ui/Button';
import { reverseDeposit } from '../../engine/reverseDeposit';
import { useMasterProStore } from '../../app/store/useMasterProStore';
export function ReversePlanningScreen(){ const s=useMasterProStore(); const route=s.routes[s.selectedRouteId]; const scenario=s.scenarios[route.scenarioId]; const result=s.events.length?reverseDeposit({client:s.client,rules:s.rules,route,events:s.events,scenario}).output:null; return <><PageHeader title='מודל הפוך' description='חישוב הפקדה נדרשת ואימות מול סימולציה.' actions={<Button onClick={s.actions.runSimulation}>עדכן בסיס</Button>}/><Card><h3>הפקדה נדרשת</h3><b>{result ? result.requiredMonthlyDeposit.toLocaleString('he-IL')+' ₪' : 'הרץ סימולציה תחילה'}</b><p>{result?.validated ? 'עבר אימות' : 'דורש בדיקה/פערים קיימים'}</p></Card></> }
