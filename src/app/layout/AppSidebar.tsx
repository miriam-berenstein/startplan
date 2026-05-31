import { useMasterProStore } from '../store/useMasterProStore';
const groups = [
  ['יסודות', [['control-center','שליטה'],['instructions','הוראות'],['client','שאלון'],['taxProfile','שאלון מס'],['rules','כללים']]],
  ['תכנון', [['events','אירועים'],['routes','מסלולים'],['deposits','הפקדות'],['simulation','סימולציה'],['timeline','ציר זמן']]],
  ['מנועים', [['reverse','מודל הפוך'],['recommendations','המלצות'],['leverage','מינוף'],['tax','מס'],['risk','סיכון'],['scenarios','תרחישים']]],
  ['פלט', [['comparisons','השוואות'],['dashboard','דשבורד'],['summary','סיכום לקוח'],['reports','Export'],['warnings','אזהרות'],['qa','QA']]],
] as const;
export function AppSidebar(){ const selected=useMasterProStore(s=>s.ui.selectedScreen); const select=useMasterProStore(s=>s.actions.selectScreen); return <nav className='sidebar'>{groups.map(([group,items])=><section key={group}><h4>{group}</h4>{items.map(([id,label])=><button data-qa={`nav-${id}`} className={selected===id?'active':''} key={id} onClick={()=>select(id)}>{label}</button>)}</section>)}</nav> }
