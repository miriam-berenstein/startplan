import type { ComparisonItem, SimulationSnapshot, PlanRoute } from '../shared/types/domain';
export function compareSnapshots(snapshots: Record<string, SimulationSnapshot>, routes: Record<string, PlanRoute>): ComparisonItem[] {
 return Object.values(snapshots).map(s=>({ routeId:s.routeId, name:routes[s.routeId]?.name ?? s.routeId, endingBalance:s.totals.endingBalance, warnings:s.warnings.length, deficits:s.warnings.reduce((sum,w)=>sum+(Number((w.message.match(/[\d,]+/)?.[0] ?? '0').replace(/,/g,''))||0),0), leverage:s.totals.loans }));
}
