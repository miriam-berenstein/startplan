export type Currency = number;
export type MonthIndex = number;
export type Percent = number;
export type RouteId = string;
export type ScenarioId = string;
export type RuleId = string;
export type EventId = string;
export type EngineId = string;
export type ScreenId = string;

export type ClientProfile = {
  id: string;
  fatherAge: number;
  motherAge?: number;
  retirementAge: number;
  numberOfChildren: number;
  firstEventInMonths: number;
  monthsBetweenEvents: number;
  initialCapital: Currency;
  baseMonthlyDeposit: Currency;
  defaultEventTarget: Currency;
};

export type FamilyEvent = {
  id: EventId;
  name: string;
  eventNumber: number;
  targetMonth: MonthIndex;
  targetAmount: Currency;
  minimumAllowedFundingPercent: Percent;
};

export type DepositPolicy = {
  monthlyDeposit: Currency;
  gradedSteps?: Array<{ fromMonth: MonthIndex; amount: Currency }>;
  oneTimeDeposits?: Array<{ month: MonthIndex; amount: Currency; note: string }>;
};

export type PlanRoute = {
  id: RouteId;
  name: string;
  type: 'fixed' | 'graded' | 'reverse' | 'custom';
  leverageEnabled: boolean;
  taxEnabled: boolean;
  scenarioId: ScenarioId;
  deposits: DepositPolicy;
  explanation: string;
  pros: string[];
  cons: string[];
};

export type RuleSet = {
  managementFeeAnnual: Percent;
  defaultAnnualReturn: Percent;
  taxEnabledDefault: boolean;
  capitalGainTaxRate: Percent;
  maxLtv: Percent;
  leverageIntervalMonths: number;
  maxOneTimeDepositRecommendation: Currency;
  maxMonthlyDepositRecommendation: Currency;
  recommendationIncreaseMonthsLimit: number;
  reverseDepositMonthsBuffer: number;
  stopDepositsAtRetirement: boolean;
};

export type Scenario = { id: ScenarioId; name: string; annualReturn: Percent; volatility?: Percent; stressLoss?: Percent };

export type SystemWarning = { id: string; severity: 'info' | 'warning' | 'critical'; title: string; message: string; month?: MonthIndex; eventId?: EventId };
export type QAFlag = { id: string; status: 'pass' | 'fail' | 'manual'; message: string };
export type ExplanationNode = { title: string; body: string; data?: Record<string, string | number | boolean> };

export type MonthlySimulationRow = {
  month: MonthIndex;
  openingBalance: Currency;
  regularDeposit: Currency;
  oneTimeDeposit: Currency;
  leverageDraw: Currency;
  returnAmount: Currency;
  managementFee: Currency;
  eventWithdrawal: Currency;
  eventId?: EventId;
  eventNumber?: number;
  taxPaid: Currency;
  loanRepayment: Currency;
  closingBalance: Currency;
  liquidityStatus: 'ok' | 'warning' | 'failure';
  actionDetails?: ActionDetail[];
  notes: string[];
};

export type ActionDetail = {
  kind: 'withdrawal' | 'leverage' | 'tax' | 'warning';
  title: string;
  amount?: Currency;
  explanation: string;
  ruleIds: RuleId[];
};

export type SimulationSnapshot = {
  routeId: RouteId;
  rows: MonthlySimulationRow[];
  totals: { deposits: Currency; returns: Currency; fees: Currency; withdrawals: Currency; taxes: Currency; loans: Currency; endingBalance: Currency };
  warnings: SystemWarning[];
  explanation: ExplanationNode[];
};

export type Recommendation = { id: string; type: 'increaseMonthlyDeposit'|'oneTimeDeposit'|'delayEvent'|'partialLeverage'|'reduceEventFunding'|'changeRoute'; title: string; impact: string; requiresApproval: true };
export type ComparisonItem = { routeId: RouteId; name: string; endingBalance: Currency; warnings: number; deficits: Currency; leverage: Currency };
