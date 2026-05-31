import { PageHeader } from '../../shared/ui/PageHeader';
import { Card } from '../../shared/ui/Card';
import { useMasterProStore } from '../../app/store/useMasterProStore';
export function ClientQuestionnaireScreen(){ const c=useMasterProStore(s=>s.client); const update=useMasterProStore(s=>s.actions.updateClient); return <><PageHeader title='שאלון לקוח' description='נתוני בסיס שמזינים את כל המנועים.'/><Card><div className='form-grid'>{Object.entries({fatherAge:'גיל אב',retirementAge:'גיל פרישה',numberOfChildren:'מספר ילדים',initialCapital:'הון עצמי',baseMonthlyDeposit:'הפקדה חודשית',defaultEventTarget:'יעד לכל אירוע'}).map(([k,label])=><label key={k}>{label}<input type='number' value={(c as any)[k]} onChange={e=>update({[k]:Number(e.target.value)} as any)}/></label>)}</div></Card></> }
