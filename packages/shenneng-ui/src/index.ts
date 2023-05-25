/*
 * @Description:
 * @Author: lihao
 * @Date: 2023-04-18 13:24:10
 * @LastEditors: lihao
 * @LastEditTime: 2023-05-22 09:36:44
 */
import Button from './button';
import Charts from './charts';
import Checkbox from './checkbox';
import Container from './container';
import EconomicIndicators from './economic-indicators';
import EfficiencyAnalysis from './efficiency-analysis';
import ElectricEnergyQuality from './electric-energy-quality';
import EnergyMonitoring from './energy-monitoring';
import EquipmentCondition from './equipment-condition';
import EquipmentQueryOperation from './equipment-query-operation';
import GlobalSchematic from './global-schematic';
import Img from './img';
import IntelligenceReportCloud from './intelligence-report-cloud';
import IntelligenceReportCold from './intelligence-report-cold';
import IntelligenceReportEletric from './intelligence-report-eletric';
import IntelligenceReportHeat from './intelligence-report-heat';
import IntelligenceReportWater from './intelligence-report-water';
import LoadForecasting from './loadForecasting';
import MulticolorImageLight from './multicolor-image-light';
import MulticolorPolymorphicLight from './multicolor-polymorphic-light';
import MulticolorSingleLight from './multicolor-single-light';
// import MulticolorTextLight from './multicolor-text-light';
import OperationalAnalysis from './operational-analysis';
import OperationsAnalysis from './operations-analysis';
import OperationsAnalysisHeat from './operations-analysis-heat';
import OptimalRegulationHeat from './optimal-regulation-heat';
import Overlay from './overlay';
import Page from './page';
import Qrcode from './qrcode';
import SuspendedWindow from './suspended-window';
import SystemDataCumulation from './system-data-cumulation';
import Text from './text';
import WarningTableList from './warning-table-list';

const ui: Record<string, any> = {
  page: Page,
  container: Container,
  button: Button,
  text: Text,
  img: Img,
  qrcode: Qrcode,
  checkbox: Checkbox,
  overlay: Overlay,
  globalSchematic: GlobalSchematic,
  multicolorImageLight: MulticolorImageLight,
  multicolorPolymorphicLight: MulticolorPolymorphicLight,
  multicolorSingleLight: MulticolorSingleLight,
  // multicolorTextLight: MulticolorTextLight,
  charts: Charts,
  equipmentCondition: EquipmentCondition,
  economicIndicators: EconomicIndicators,
  warningTableList: WarningTableList,
  equipmentQueryOperation: EquipmentQueryOperation,
  systemDataCumulation: SystemDataCumulation,
  operationalAnalysis: OperationalAnalysis,
  energyMonitoring: EnergyMonitoring,
  electricEnergyQuality: ElectricEnergyQuality,
  operationsAnalysis: OperationsAnalysis,
  efficiencyAnalysis: EfficiencyAnalysis,
  intelligenceReportEletric: IntelligenceReportEletric,
  suspendedWindow: SuspendedWindow,
  intelligenceReportHeat: IntelligenceReportHeat,
  intelligenceReportCold: IntelligenceReportCold,
  operationsAnalysisHeat: OperationsAnalysisHeat,
  loadForecasting: LoadForecasting,
  optimalRegulationHeat: OptimalRegulationHeat,
  intelligenceReportWater: IntelligenceReportWater,
  intelligenceReportCloud: IntelligenceReportCloud,
};

export default ui;
