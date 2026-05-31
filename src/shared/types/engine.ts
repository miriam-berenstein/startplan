import type { ClientProfile, ExplanationNode, FamilyEvent, PlanRoute, QAFlag, RuleSet, Scenario, SystemWarning } from './domain';
export type EngineResult<TOutput> = { ok: boolean; output: TOutput; warnings: SystemWarning[]; explanation: ExplanationNode[]; qaFlags: QAFlag[] };
export type EngineContext = { client: ClientProfile; rules: RuleSet; route: PlanRoute; events: FamilyEvent[]; scenario: Scenario };
