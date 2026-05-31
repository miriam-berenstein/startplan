import { PageHeader } from '../../shared/ui/PageHeader';
import { Button } from '../../shared/ui/Button';
import { DataTable } from '../../shared/ui/DataTable';
import { useMasterProStore } from '../../app/store/useMasterProStore';
export function EventsScreen(){ const run=useMasterProStore(s=>s.actions.runSimulation); const events=useMasterProStore(s=>s.events); return <><PageHeader title='אירועים' description='רצף האירועים שנבנה מתוך השאלון.' actions={<Button onClick={run}>עדכן אירועים</Button>}/><DataTable rows={events as any[]} columns={[{key:'eventNumber',label:'מס׳ אירוע'},{key:'name',label:'שם'},{key:'targetMonth',label:'חודש יעד'},{key:'targetAmount',label:'יעד'}]}/></> }
