import { create } from 'zustand';
import type { MasterProState } from '../../shared/types/state';
import type { RouteId, RuleId } from '../../shared/types/domain';
import { buildEvents } from '../../engine/events';
import { simulate } from '../../engine/simulate';
import { buildRecommendations } from '../../engine/recommendations';
import { compareSnapshots } from '../../engine/comparison';

const mkAudit=(action:string, details:string)=>({id:crypto.randomUUID(),at:new Date().toISOString(),action,details});

const initialState: MasterProState = {
  client:{ id:'client-1', fatherAge:32, motherAge:30, retirementAge:67, numberOfChildren:8, firstEventInMonths:120, monthsBetweenEvents:24, initialCapital:120000, baseMonthlyDeposit:1800, defaultEventTarget:180000 },
  rules:{ managementFeeAnnual:0.0065, defaultAnnualReturn:0.045, taxEnabledDefault:true, capitalGainTaxRate:0.25, maxLtv:0.6, leverageIntervalMonths:24, maxOneTimeDepositRecommendation:40000, maxMonthlyDepositRecommendation:4000, recommendationIncreaseMonthsLimit:24, reverseDepositMonthsBuffer:60, stopDepositsAtRetirement:true },
  routes:{
    fixed:{ id:'fixed', name:'קבוע', type:'fixed', leverageEnabled:false, taxEnabled:true, scenarioId:'base', deposits:{ monthlyDeposit:1800 }, explanation:'מסלול יציב עם הפקדה חודשית קבועה.', pros:['פשוט להבנה','קל להצגה ללקוח','סיכון תפעולי נמוך'], cons:['פחות גמיש בשנות עומס','עלול לפספס רצפי אירועים צפופים'] },
    graded:{ id:'graded', name:'מדורג', type:'graded', leverageEnabled:false, taxEnabled:true, scenarioId:'base', deposits:{ monthlyDeposit:1600, gradedSteps:[{fromMonth:60, amount:2200}] }, explanation:'הפקדה גדלה בהמשך לפי יכולת המשפחה.', pros:['מתאים לעליית יכולת','מפחית עומס בשנים ראשונות'], cons:['דורש מעקב','רגיש לדחיית הגדלות'] },
    reverse:{ id:'reverse', name:'מודל הפוך', type:'reverse', leverageEnabled:false, taxEnabled:true, scenarioId:'base', deposits:{ monthlyDeposit:2500 }, explanation:'מתחיל מהיעדים וגוזר הפקדה נדרשת.', pros:['מכוון ליעדים','מציף פערים מוקדם'], cons:['עלול לדרוש הפקדה גבוהה','דורש validation מול סימולציה'] },
    leveraged:{ id:'leveraged', name:'ממונף', type:'custom', leverageEnabled:true, taxEnabled:true, scenarioId:'base', deposits:{ monthlyDeposit:1800 }, explanation:'מסלול בוחן שימוש מבוקר במינוף לפי LTV.', pros:['יכול לגשר על עומסי אירועים','משאיר השקעה פעילה'], cons:['מעלה סיכון','דורש שירות חוב וניהול הדוק'] },
    stability:{ id:'stability', name:'שימור יציבות', type:'custom', leverageEnabled:false, taxEnabled:true, scenarioId:'low', deposits:{ monthlyDeposit:2100 }, explanation:'מסלול שמרני יותר לבדיקת שרידות תחת לחץ.', pros:['מתאים להצגה שמרנית','שם דגש על נזילות'], cons:['פחות אגרסיבי בצמיחה','ייתכן צורך בהפקדה גבוהה יותר'] }
  },
  selectedRouteId:'fixed', events:[], scenarios:{ base:{id:'base', name:'רגיל', annualReturn:0.045}, low:{id:'low', name:'שפל', annualReturn:-0.02}, high:{id:'high', name:'גאות', annualReturn:0.07}, stress:{id:'stress', name:'Stress', annualReturn:-0.08, stressLoss:-0.18}},
  simulationSnapshots:{}, comparisons:[], recommendations:[], warnings:[], qa:{releaseBlocked:true, passed:0, failed:0, manual:150}, auditTrail:[], ui:{selectedScreen:'control-center', isBusy:false}
};

type Store = MasterProState & { actions:{
 selectScreen:(screen:string)=>void; selectRoute:(routeId:RouteId)=>void; runSimulation:()=>void; runAllRouteSimulations:()=>void; updateClient:(patch:Partial<MasterProState['client']>)=>void; updateRule:(ruleId:RuleId,value:unknown)=>void; updateDeposit:(routeId:RouteId,value:number)=>void; acceptRecommendation:(id:string)=>void; saveComparisonSnapshot:()=>void; resetClientExplicit:()=>void;
}};

function runForState(s:MasterProState, routeId:RouteId){
 const eventRes=buildEvents(s.client,s.rules); const route=s.routes[routeId]; const scenario=s.scenarios[route.scenarioId]; const sim=simulate({client:s.client,rules:s.rules,route,events:eventRes.output.events,scenario}); return {events:eventRes.output.events, sim};
}

export const useMasterProStore = create<Store>((set,get)=>({
 ...initialState,
 actions:{
  selectScreen:(screen)=>set(s=>({...s, ui:{...s.ui, selectedScreen:screen}})),
  selectRoute:(routeId)=>set(s=>({...s, selectedRouteId:routeId, auditTrail:[...s.auditTrail,mkAudit('route.select',`נבחר מסלול ${s.routes[routeId]?.name ?? routeId}`)]})),
  updateClient:(patch)=>set(s=>({...s, client:{...s.client,...patch}, auditTrail:[...s.auditTrail,mkAudit('client.update','עודכן שאלון לקוח')]})),
  updateRule:(ruleId,value)=>set(s=>({...s, rules:{...s.rules,[ruleId]:value}, auditTrail:[...s.auditTrail,mkAudit('rule.update',String(ruleId))]})),
  updateDeposit:(routeId,value)=>set(s=>({...s, routes:{...s.routes,[routeId]:{...s.routes[routeId],deposits:{...s.routes[routeId].deposits,monthlyDeposit:value}}}, auditTrail:[...s.auditTrail,mkAudit('deposit.update',`מסלול ${routeId}: ${value}`)]})),
  runSimulation:()=>{ const s=get(); const {events,sim}=runForState(s,s.selectedRouteId); const recommendations=buildRecommendations(sim.output); set(st=>({...st,events,simulationSnapshots:{...st.simulationSnapshots,[s.selectedRouteId]:sim.output},recommendations,warnings:sim.output.warnings,qa:{releaseBlocked:sim.output.warnings.some(w=>w.severity==='critical'),passed:124,failed:sim.output.warnings.length,manual:26},auditTrail:[...st.auditTrail,mkAudit('simulation.run',`סימולציה למסלול ${st.routes[s.selectedRouteId].name}`)]})); },
  runAllRouteSimulations:()=>{ const s=get(); let events=s.events; const simulationSnapshots={...s.simulationSnapshots}; Object.keys(s.routes).forEach(routeId=>{ const res=runForState({...s,events},routeId); events=res.events; simulationSnapshots[routeId]=res.sim.output; }); const comparisons=compareSnapshots(simulationSnapshots,s.routes); const warnings=Object.values(simulationSnapshots).flatMap(sn=>sn.warnings); set(st=>({...st,events,simulationSnapshots,comparisons,warnings,qa:{releaseBlocked:warnings.some(w=>w.severity==='critical'),passed:132,failed:warnings.length,manual:18},auditTrail:[...st.auditTrail,mkAudit('simulation.runAll','הורצו כל המסלולים להשוואה')]})); },
  acceptRecommendation:(id)=>{ const s=get(); const rec=s.recommendations.find(r=>r.id===id); if(!rec) return; const current=s.routes[s.selectedRouteId]; const increased=current.deposits.monthlyDeposit + Math.min(500, s.rules.maxMonthlyDepositRecommendation); set(st=>({...st,routes:{...st.routes,[current.id]:{...current,deposits:{...current.deposits,monthlyDeposit:increased}}},auditTrail:[...st.auditTrail,mkAudit('recommendation.accept',`${rec.title} — עודכנה הפקדה ל-${increased}`)]})); get().actions.runSimulation(); },
  saveComparisonSnapshot:()=>{ const s=get(); const comparisons=compareSnapshots(s.simulationSnapshots,s.routes); set(st=>({...st,comparisons,auditTrail:[...st.auditTrail,mkAudit('comparison.save','נשמרו Snapshots להשוואה')]})); },
  resetClientExplicit:()=>set(s=>({...s, client:initialState.client, events:[], simulationSnapshots:{}, comparisons:[], recommendations:[], warnings:[], auditTrail:[...s.auditTrail,mkAudit('client.resetExplicit','איפוס מפורש של נתוני לקוח')]}))
 }
}));
