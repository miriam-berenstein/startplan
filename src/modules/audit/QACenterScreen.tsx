import { PageHeader } from '../../shared/ui/PageHeader';
import { Card } from '../../shared/ui/Card';
import { releaseGate150 } from '../../shared/qa/releaseGate150';
import { useMasterProStore } from '../../app/store/useMasterProStore';
export function QACenterScreen(){ const qa=useMasterProStore(s=>s.qa); return <><PageHeader title='QA Center' description='שער חסימה לפני Release.'/><div className='grid cards-3'><Card><h3>Release blocked</h3><b>{qa.releaseBlocked?'כן':'לא'}</b></Card><Card><h3>בדיקות חובה</h3><b>{releaseGate150.length}</b></Card><Card><h3>ידני/פתוח</h3><b>{qa.manual}</b></Card></div></> }
