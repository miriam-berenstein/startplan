import type { ReactElement } from 'react';
import { AppShell } from './layout/AppShell';
import { useMasterProStore } from './store/useMasterProStore';
import { ControlCenterScreen } from '../modules/planning/ControlCenterScreen';
import { ClientQuestionnaireScreen } from '../modules/client/ClientQuestionnaireScreen';
import { EventsScreen } from '../modules/events/EventsScreen';
import { RoutesScreen } from '../modules/routes/RoutesScreen';
import { ComparisonsScreen } from '../modules/routes/ComparisonsScreen';
import { DepositsScreen } from '../modules/cashflows/DepositsScreen';
import { LeverageScreen } from '../modules/cashflows/LeverageScreen';
import { SimulationScreen } from '../modules/simulation/SimulationScreen';
import { TimelineScreen } from '../modules/simulation/TimelineScreen';
import { ReversePlanningScreen } from '../modules/reverse-planning/ReversePlanningScreen';
import { RecommendationsScreen } from '../modules/planning/RecommendationsScreen';
import { RiskScreen } from '../modules/risk/RiskScreen';
import { ScenariosScreen } from '../modules/risk/ScenariosScreen';
import { ScenarioLabScreen } from '../modules/risk/ScenarioLabScreen';
import { TaxScreen } from '../modules/tax/TaxScreen';
import { TaxQuestionnaireScreen } from '../modules/tax/TaxQuestionnaireScreen';
import { ExportCenterScreen } from '../modules/reports/ExportCenterScreen';
import { AgentDashboardScreen } from '../modules/reports/AgentDashboardScreen';
import { ClientSummaryScreen } from '../modules/reports/ClientSummaryScreen';
import { QACenterScreen } from '../modules/audit/QACenterScreen';
import { InstructionsScreen } from '../modules/audit/InstructionsScreen';
import { RulesScreen } from '../modules/audit/RulesScreen';
import { WarningsScreen } from '../modules/audit/WarningsScreen';

export function App(){
  const screen=useMasterProStore(s=>s.ui.selectedScreen);
  const map:Record<string, ReactElement>={
    'control-center':<ControlCenterScreen/>,
    instructions:<InstructionsScreen/>, client:<ClientQuestionnaireScreen/>, taxProfile:<TaxQuestionnaireScreen/>, rules:<RulesScreen/>,
    events:<EventsScreen/>, routes:<RoutesScreen/>, deposits:<DepositsScreen/>, leverage:<LeverageScreen/>, simulation:<SimulationScreen/>, timeline:<TimelineScreen/>,
    reverse:<ReversePlanningScreen/>, recommendations:<RecommendationsScreen/>, risk:<RiskScreen/>, scenarios:<ScenariosScreen/>, scenarioLab:<ScenarioLabScreen/>,
    tax:<TaxScreen/>, comparisons:<ComparisonsScreen/>, dashboard:<AgentDashboardScreen/>, summary:<ClientSummaryScreen/>, reports:<ExportCenterScreen/>, warnings:<WarningsScreen/>, qa:<QACenterScreen/>
  };
  return <AppShell>{map[screen] ?? <ControlCenterScreen/>}</AppShell>;
}
