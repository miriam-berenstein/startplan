import type { EngineContext, EngineResult } from '../shared/types/engine';
import { simulate } from './simulate';
export type ReverseResult = { requiredMonthlyDeposit: number; validated: boolean; remainingCriticalWarnings: number };
export function reverseDeposit(context: EngineContext): EngineResult<ReverseResult> {
  let low = 0, high = Math.max(1000, context.client.defaultEventTarget);
  let best = high, validation = simulate({...context, route:{...context.route, deposits:{...context.route.deposits, monthlyDeposit: high}}});
  for (let i=0;i<24;i++) {
    const mid = (low+high)/2;
    const res = simulate({...context, route:{...context.route, deposits:{...context.route.deposits, monthlyDeposit: mid}}});
    const fails = res.output.warnings.filter(w=>w.severity==='critical').length;
    if (fails===0) { best=mid; high=mid; validation=res; } else low=mid;
  }
  const remaining = validation.output.warnings.filter(w=>w.severity==='critical').length;
  return { ok:true, output:{ requiredMonthlyDeposit: Math.ceil(best), validated: remaining===0, remainingCriticalWarnings: remaining }, warnings:validation.output.warnings, explanation:[{title:'מודל הפוך', body:'בוצע חיפוש בינארי להפקדה חודשית מינימלית ואימות מול סימולציה.'}], qaFlags:[] };
}
