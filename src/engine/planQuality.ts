import type { SimulationSnapshot } from '../shared/types/domain';
export type PlanQuality = { score: number; label: 'מצוין' | 'טוב' | 'דורש תשומת לב' | 'קריטי'; reasons: string[] };
export function calculatePlanQuality(snapshot?: SimulationSnapshot): PlanQuality {
  if (!snapshot) return { score: 0, label: 'קריטי', reasons: ['לא הורצה סימולציה'] };
  const critical = snapshot.warnings.filter(w => w.severity === 'critical').length;
  const warningMonths = snapshot.rows.filter(r => r.liquidityStatus === 'warning').length;
  const loanRatio = snapshot.totals.loans / Math.max(1, snapshot.totals.withdrawals + snapshot.totals.loans);
  const score = Math.max(0, Math.round(100 - critical * 18 - Math.min(25, warningMonths / 12) - loanRatio * 18));
  const label = score >= 85 ? 'מצוין' : score >= 70 ? 'טוב' : score >= 50 ? 'דורש תשומת לב' : 'קריטי';
  const reasons = [critical ? `${critical} פערי מימון קריטיים` : 'אין פערי מימון קריטיים', warningMonths ? `${warningMonths} חודשי נזילות חלשה` : 'נזילות תקינה ברוב החודשים', loanRatio > 0 ? `שימוש במינוף: ${Math.round(loanRatio * 100)}% ממקורות האירועים` : 'ללא תלות במינוף'];
  return { score, label, reasons };
}
