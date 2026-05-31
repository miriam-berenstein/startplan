import type { Currency, Percent, RuleSet } from '../shared/types/domain';
export type TaxLot = { principalRemaining: Currency; gainsRemaining: Currency };
export type TaxResult = { principalWithdrawn: Currency; gainsWithdrawn: Currency; taxableAmount: Currency; taxPaid: Currency; taxRateUsed: Percent };
export function calculateTax(withdrawal: Currency, lot: TaxLot, rules: RuleSet): TaxResult {
  if (!rules.taxEnabledDefault || withdrawal <= 0) return { principalWithdrawn: Math.min(withdrawal, lot.principalRemaining), gainsWithdrawn: 0, taxableAmount: 0, taxPaid: 0, taxRateUsed: 0 };
  const principalWithdrawn = Math.min(withdrawal, lot.principalRemaining);
  const gainsWithdrawn = Math.max(0, withdrawal - principalWithdrawn);
  const taxableAmount = Math.min(gainsWithdrawn, lot.gainsRemaining);
  return { principalWithdrawn, gainsWithdrawn, taxableAmount, taxPaid: taxableAmount * rules.capitalGainTaxRate, taxRateUsed: rules.capitalGainTaxRate };
}
