import type { ClientProfile, ComparisonItem, FamilyEvent, PlanRoute, Recommendation, RouteId, RuleSet, Scenario, ScenarioId, SimulationSnapshot, SystemWarning } from './domain';
export type AuditEvent = { id: string; at: string; action: string; details: string };
export type UIState = { selectedScreen: string; isBusy: boolean };
export type QAState = { releaseBlocked: boolean; passed: number; failed: number; manual: number };
export type MasterProState = {
  client: ClientProfile;
  rules: RuleSet;
  routes: Record<RouteId, PlanRoute>;
  selectedRouteId: RouteId;
  events: FamilyEvent[];
  scenarios: Record<ScenarioId, Scenario>;
  simulationSnapshots: Record<RouteId, SimulationSnapshot>;
  comparisons: ComparisonItem[];
  recommendations: Recommendation[];
  warnings: SystemWarning[];
  qa: QAState;
  auditTrail: AuditEvent[];
  ui: UIState;
};
