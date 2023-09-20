/*
 * @Description:
 * @Author: lihao
 * @Date: 2023-04-18 13:24:10
 * @LastEditors: lihao
 * @LastEditTime: 2023-05-23 17:10:14
 */
import AssetInformationPv from './asset-information-pv';
import Button from './button';
import Carousel from './carousel';
import Charts from './charts';
import Checkbox from './checkbox';
import Container from './container';
import ControlCharge from './control-charge';
import ControlMode from './control-mode';
import ControlPanelEnergy from './control-panel-energy';
import EconomicIndicators from './economic-indicators';
import EfficiencyAnalysis from './efficiency-analysis';
import ElectricEnergyQuality from './electric-energy-quality';
import EnergyMonitoring from './energy-monitoring';
import EquipmentCondition from './equipment-condition';
import EquipmentMonitoringCharge from './equipment-monitoring-charge';
import EquipmentQueryOperation from './equipment-query-operation';
import FeeSettingEnergy from './fee-setting-energy';
import GlobalSchematic from './global-schematic';
import Img from './img';
import IntelligenceReportCharge from './intelligence-report-charge';
import IntelligenceReportCloud from './intelligence-report-cloud';
import IntelligenceReportCold from './intelligence-report-cold';
import IntelligenceReportEletric from './intelligence-report-eletric';
import IntelligenceReportHeat from './intelligence-report-heat';
import IntelligenceReportPv from './intelligence-report-pv';
import IntelligenceReportWater from './intelligence-report-water';
import LoadForecasting from './loadForecasting';
import MulticolorImageLight from './multicolor-image-light';
import MulticolorPolymorphicLight from './multicolor-polymorphic-light';
import MulticolorSingleLight from './multicolor-single-light';
import OperationRecords from './operation-records';
import OperationalAnalysis from './operational-analysis';
import OperationsAnalysis from './operations-analysis';
import OperationsAnalysisCharge from './operations-analysis-charge';
import OperationsAnalysisCold from './operations-analysis-cold';
import OperationsAnalysisHeat from './operations-analysis-heat';
import OperationsAnalysisPv from './operations-analysis-pv';
import OperationsAnalysisWater from './operations-analysis-water';
import OptimalRegulationHeat from './optimal-regulation-heat';
import Overlay from './overlay';
import Page from './page';
import Qrcode from './qrcode';
import RunningParameterEnergy from './running-parameter-energy';
import SuspendedWindow from './suspended-window';
import SystemDataCumulation from './system-data-cumulation';
import Text from './text';
import WarningTableList from './warning-table-list';

const ui: Record<string, any> = {
  assetInformationPv: AssetInformationPv,
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
  charts: Charts,
  equipmentCondition: EquipmentCondition,
  economicIndicators: EconomicIndicators,
  warningTableList: WarningTableList,
  operationRecords: OperationRecords,
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
  operationsAnalysisWater: OperationsAnalysisWater,
  operationsAnalysisPv: OperationsAnalysisPv,
  operationsAnalysisCharge: OperationsAnalysisCharge,
  loadForecasting: LoadForecasting,
  optimalRegulationHeat: OptimalRegulationHeat,
  intelligenceReportWater: IntelligenceReportWater,
  intelligenceReportCloud: IntelligenceReportCloud,
  operationsAnalysisCold: OperationsAnalysisCold,
  intelligenceReportPv: IntelligenceReportPv,
  equipmentMonitoringCharge: EquipmentMonitoringCharge,
  intelligenceReportCharge: IntelligenceReportCharge,
  controlCharge: ControlCharge,
  carousel: Carousel,
  feeSettingEnergy: FeeSettingEnergy,
  runningParameterEnergy: RunningParameterEnergy,
  controlPanelEnergy: ControlPanelEnergy,
  controlMode: ControlMode,
};

export default ui;
