import type { EngineContext, EngineResult } from '../shared/types/engine';
import type { ActionDetail, MonthlySimulationRow, SimulationSnapshot, SystemWarning } from '../shared/types/domain';
import { calculateMonthlyFee } from './fees';
import { calculateTax, type TaxLot } from './tax';

type ActiveLoan = { id: string; remainingPrincipal: number; monthlyPayment: number; monthsLeft: number; interestAnnual: number; sourceEventNumber: number };

function gradedDepositForMonth(context: EngineContext, month: number): number {
  const steps = context.route.deposits.gradedSteps ?? [];
  const activeStep = steps.filter(s => s.fromMonth <= month).sort((a,b) => b.fromMonth - a.fromMonth)[0];
  return activeStep?.amount ?? context.route.deposits.monthlyDeposit;
}

function buildLoan(amount: number, eventNumber: number): ActiveLoan {
  const months = 60;
  const interestAnnual = 0.055;
  const monthlyRate = interestAnnual / 12;
  const monthlyPayment = monthlyRate === 0 ? amount / months : amount * monthlyRate / (1 - Math.pow(1 + monthlyRate, -months));
  return { id: `loan-${eventNumber}-${Date.now()}`, remainingPrincipal: amount, monthlyPayment, monthsLeft: months, interestAnnual, sourceEventNumber: eventNumber };
}

export function simulate(context: EngineContext): EngineResult<SimulationSnapshot> {
  const lastEventMonth = Math.max(...context.events.map(e => e.targetMonth), 0);
  const horizonMonths = Math.max(360, lastEventMonth + context.rules.reverseDepositMonthsBuffer + 60);
  let balance = context.client.initialCapital;
  const taxLot: TaxLot = { principalRemaining: context.client.initialCapital, gainsRemaining: 0 };
  const rows: MonthlySimulationRow[] = [];
  const warnings: SystemWarning[] = [];
  const activeLoans: ActiveLoan[] = [];
  const totals = { deposits: 0, returns: 0, fees: 0, withdrawals: 0, taxes: 0, loans: 0, endingBalance: 0 };
  const monthlyReturnRate = context.scenario.annualReturn / 12;
  const eventByMonth = new Map(context.events.map(e => [e.targetMonth, e]));

  for (let month = 0; month <= horizonMonths; month++) {
    const openingBalance = balance;
    const retirementMonth = Math.max(0, (context.client.retirementAge - context.client.fatherAge) * 12);
    const regularDeposit = context.rules.stopDepositsAtRetirement && month > retirementMonth ? 0 : gradedDepositForMonth(context, month);
    const oneTimeDeposit = context.route.deposits.oneTimeDeposits?.filter(d => d.month === month).reduce((sum, d) => sum + d.amount, 0) ?? 0;
    balance += regularDeposit + oneTimeDeposit;
    taxLot.principalRemaining += regularDeposit + oneTimeDeposit;

    let loanRepayment = 0;
    for (const loan of [...activeLoans]) {
      if (loan.monthsLeft <= 0) continue;
      const monthlyInterest = loan.remainingPrincipal * (loan.interestAnnual / 12);
      const principalPay = Math.min(loan.remainingPrincipal, Math.max(0, loan.monthlyPayment - monthlyInterest));
      const payment = Math.min(balance, monthlyInterest + principalPay);
      loanRepayment += payment;
      balance -= payment;
      loan.remainingPrincipal = Math.max(0, loan.remainingPrincipal - principalPay);
      loan.monthsLeft -= 1;
    }

    const returnAmount = balance * monthlyReturnRate;
    balance += returnAmount;
    taxLot.gainsRemaining += Math.max(0, returnAmount);

    const { monthlyFee } = calculateMonthlyFee(Math.max(0, balance), context.rules);
    balance -= monthlyFee;

    const event = eventByMonth.get(month);
    let eventWithdrawal = 0;
    let leverageDraw = 0;
    let taxPaid = 0;
    const actionDetails: ActionDetail[] = [];

    if (event) {
      let remainingNeed = event.targetAmount;
      const availableWithdrawal = Math.min(Math.max(0, balance), remainingNeed);
      eventWithdrawal = availableWithdrawal;
      if (availableWithdrawal > 0) {
        const tax = context.route.taxEnabled && context.rules.taxEnabledDefault ? calculateTax(availableWithdrawal, taxLot, context.rules) : { principalWithdrawn: availableWithdrawal, gainsWithdrawn: 0, taxableAmount: 0, taxPaid: 0, taxRateUsed: 0 };
        taxPaid = Math.min(Math.max(0, balance - availableWithdrawal), tax.taxPaid);
        balance -= availableWithdrawal + taxPaid;
        remainingNeed -= availableWithdrawal;
        taxLot.principalRemaining = Math.max(0, taxLot.principalRemaining - tax.principalWithdrawn);
        taxLot.gainsRemaining = Math.max(0, taxLot.gainsRemaining - tax.gainsWithdrawn);
        actionDetails.push({ kind: 'withdrawal', title: `משיכה לאירוע ${event.eventNumber}`, amount: availableWithdrawal, explanation: `בוצעה משיכה עבור ${event.name}. המשיכה נלקחה מהיתרה הזמינה לפני בחינת מינוף נוסף.`, ruleIds: ['withdrawals.policy'] });
        if (taxPaid > 0) actionDetails.push({ kind: 'tax', title: 'אירוע מס', amount: taxPaid, explanation: 'המס חושב רק על רכיב הרווח מתוך המשיכה. קרן אינה חייבת במס.', ruleIds: ['tax.capitalGainRate'] });
      }

      if (remainingNeed > 0 && context.route.leverageEnabled) {
        const currentDebt = activeLoans.reduce((sum, loan) => sum + loan.remainingPrincipal, 0);
        const maxDebtAllowed = Math.max(0, openingBalance * context.rules.maxLtv);
        const capacityLeft = Math.max(0, maxDebtAllowed - currentDebt);
        const monthlyDebtLoad = activeLoans.reduce((sum, loan) => sum + (loan.monthsLeft > 0 ? loan.monthlyPayment : 0), 0);
        const serviceCapacity = Math.max(0, regularDeposit * 0.55 - monthlyDebtLoad);
        const maxLoanByService = serviceCapacity <= 0 ? 0 : serviceCapacity * 48;
        leverageDraw = Math.min(remainingNeed, capacityLeft, maxLoanByService);
        if (leverageDraw > 0) {
          const loan = buildLoan(leverageDraw, event.eventNumber);
          activeLoans.push(loan);
          remainingNeed -= leverageDraw;
          totals.loans += leverageDraw;
          actionDetails.push({ kind: 'leverage', title: `מינוף לאירוע ${event.eventNumber}`, amount: leverageDraw, explanation: `בוצע מינוף חלקי/מלא לפי מגבלת LTV ויכולת שירות חוב. החזר משוער: ${Math.round(loan.monthlyPayment).toLocaleString('he-IL')} ₪ לחודש ל־60 חודשים.`, ruleIds: ['leverage.maxLtv', 'leverage.intervalMonths'] });
        } else {
          actionDetails.push({ kind: 'warning', title: 'מינוף לא אושר', amount: remainingNeed, explanation: 'המינוף לא בוצע כי מגבלת LTV או יכולת שירות החוב לא אפשרו הלוואה בטוחה.', ruleIds: ['leverage.maxLtv'] });
        }
      } else if (remainingNeed > 0 && !context.route.leverageEnabled) {
        actionDetails.push({ kind: 'warning', title: 'מינוף לא פעיל במסלול', amount: remainingNeed, explanation: 'המסלול הנוכחי אינו מאפשר מינוף. ניתן להשוות מול מסלול ממונף נפרד.', ruleIds: ['route.leverageEnabled'] });
      }

      if (remainingNeed > 0) {
        warnings.push({ id: `gap-${event.id}`, severity: 'critical', title: `פער מימון באירוע ${event.eventNumber}`, message: `חסר ${Math.round(remainingNeed).toLocaleString('he-IL')} ₪ ביחס ליעד.`, month, eventId: event.id });
        actionDetails.push({ kind: 'warning', title: 'פער מימון', amount: remainingNeed, explanation: 'המקורות הזמינים לא הספיקו לכיסוי מלא של יעד האירוע.', ruleIds: ['recommendations.minGapTrigger'] });
      }
    }

    const closingBalance = Math.max(0, balance);
    const liquidityStatus = warnings.some(w => w.month === month && w.severity === 'critical') ? 'failure' : closingBalance < context.client.defaultEventTarget * 0.2 ? 'warning' : 'ok';
    rows.push({ month, openingBalance, regularDeposit, oneTimeDeposit, leverageDraw, returnAmount, managementFee: monthlyFee, eventWithdrawal, eventId: event?.id, eventNumber: event?.eventNumber, taxPaid, loanRepayment, closingBalance, liquidityStatus, actionDetails, notes: event ? [`אירוע ${event.eventNumber}`] : [] });
    totals.deposits += regularDeposit + oneTimeDeposit;
    totals.returns += returnAmount;
    totals.fees += monthlyFee;
    totals.withdrawals += eventWithdrawal;
    totals.taxes += taxPaid;
    totals.endingBalance = closingBalance;
    balance = closingBalance;
  }

  const routeWarnings = warnings;
  return {
    ok: true,
    output: {
      routeId: context.route.id,
      rows,
      totals,
      warnings: routeWarnings,
      explanation: [{ title: 'סימולציה חודשית', body: 'הסימולציה מחשבת הפקדות, תשואות, דמי ניהול, החזרי הלוואות, משיכות, מס ומינוף לפי כללים מרכזיים.' }]
    },
    warnings: routeWarnings,
    explanation: [],
    qaFlags: []
  };
}
