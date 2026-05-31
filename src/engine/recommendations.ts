import type { Recommendation, SimulationSnapshot } from '../shared/types/domain';

export function buildRecommendations(snapshot: SimulationSnapshot): Recommendation[] {
  const critical = snapshot.warnings.filter(w => w.severity === 'critical');
  if (critical.length === 0) return [];
  const recs: Recommendation[] = [];
  const first = critical[0];
  recs.push({ id: 'rec-increase-monthly', type: 'increaseMonthlyDeposit', title: `הגדלת הפקדה לטיפול ב${first.title}`, impact: 'הגדלת הפקדה חודשית מריצה סימולציה חוזרת ומצמצמת פערי מימון עתידיים. ההמלצה מיושמת רק לאחר אישור.', requiresApproval: true });
  recs.push({ id: 'rec-one-time', type: 'oneTimeDeposit', title: 'בדיקת הפקדה חד־פעמית', impact: 'הזרמה חד־פעמית לפני שנות עומס יכולה לשפר נזילות בלי לשנות את כל המסלול.', requiresApproval: true });
  recs.push({ id: 'rec-delay-event', type: 'delayEvent', title: 'בדיקת דחיית אירוע / הגדלת מרווח', impact: 'הרחבת מרווח בין אירועים נותנת Recovery Window ומפחיתה לחץ רציף.', requiresApproval: true });
  if (snapshot.totals.loans === 0) recs.push({ id: 'rec-partial-leverage', type: 'partialLeverage', title: 'בדיקת מינוף חלקי מבוקר', impact: 'מינוף חלקי עשוי לגשר על אירוע נקודתי, בכפוף ליכולת שירות חוב ו־LTV.', requiresApproval: true });
  return recs;
}
