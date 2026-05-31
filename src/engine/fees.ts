import type { Currency, Percent, RuleSet } from '../shared/types/domain';
export function calculateMonthlyFee(balanceBeforeFee: Currency, rules: RuleSet): { monthlyFee: Currency; annualRateUsed: Percent } {
  const monthlyRate = rules.managementFeeAnnual / 12;
  return { monthlyFee: Math.max(0, balanceBeforeFee * monthlyRate), annualRateUsed: rules.managementFeeAnnual };
}
