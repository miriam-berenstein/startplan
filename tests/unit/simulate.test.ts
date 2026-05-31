import { describe, expect, it } from 'vitest';
import { buildEvents } from '../../src/engine/events';
import { simulate } from '../../src/engine/simulate';

describe('simulate', () => {
  it('returns stable monthly rows without NaN', () => {
    const client = { id:'c', fatherAge:32, retirementAge:67, numberOfChildren:2, firstEventInMonths:12, monthsBetweenEvents:12, initialCapital:100000, baseMonthlyDeposit:2000, defaultEventTarget:50000 };
    const rules = { managementFeeAnnual:0.0065, defaultAnnualReturn:0.045, taxEnabledDefault:true, capitalGainTaxRate:0.25, maxLtv:0.6, leverageIntervalMonths:24, maxOneTimeDepositRecommendation:40000, maxMonthlyDepositRecommendation:4000, recommendationIncreaseMonthsLimit:24, reverseDepositMonthsBuffer:60, stopDepositsAtRetirement:true };
    const route = { id:'r', name:'קבוע', type:'fixed' as const, leverageEnabled:false, taxEnabled:true, scenarioId:'base', deposits:{monthlyDeposit:2000}, explanation:'', pros:[], cons:[] };
    const events = buildEvents(client, rules).output.events;
    const res = simulate({ client, rules, route, events, scenario:{id:'base', name:'רגיל', annualReturn:0.045} });
    expect(res.output.rows.length).toBeGreaterThan(0);
    expect(res.output.rows.every(r => Number.isFinite(r.closingBalance))).toBe(true);
  });
});
