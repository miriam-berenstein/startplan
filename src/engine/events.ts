import type { ClientProfile, FamilyEvent, RuleSet } from '../shared/types/domain';
import type { EngineResult } from '../shared/types/engine';
export function buildEvents(client: ClientProfile, _rules: RuleSet): EngineResult<{events: FamilyEvent[]}> {
  const events = Array.from({ length: client.numberOfChildren }, (_, i) => ({
    id: `event-${i+1}`, name: `אירוע ${i+1}`, eventNumber: i+1,
    targetMonth: client.firstEventInMonths + i * client.monthsBetweenEvents,
    targetAmount: client.defaultEventTarget,
    minimumAllowedFundingPercent: 0.5
  })).sort((a,b)=>a.targetMonth-b.targetMonth);
  return { ok: true, output: { events }, warnings: [], explanation: [{title:'בניית אירועים', body:`נבנו ${events.length} אירועים לפי שאלון הלקוח.`}], qaFlags: [] };
}
