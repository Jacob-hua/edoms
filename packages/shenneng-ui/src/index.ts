/*
 * @Description:
 * @Author: lihao
 * @Date: 2023-04-18 13:24:10
 * @LastEditors: lihao
 * @LastEditTime: 2023-04-27 10:36:03
 */
import Button from './button';
import Charts from './charts';
import Checkbox from './checkbox';
import Container from './container';
import DynamicMonitoring from './dynamic-monitoring';
import EconomicIndicators from './economic-indicators';
import ElectricEnergyQuality from './electric-energy-quality';
import EnergyEfficiencyMonitoring from './energy-efficiency-monitoring';
import EnergyMonitoring from './energy-monitoring';
import EquipmentCondition from './equipment-condition';
import EquipmentOperatingParameter from './equipment-operating-parameters';
import EquipmentQueryOperation from './equipment-query-operation';
import GlobalSchematic from './global-schematic';
import GlobalSchematicChart from './global-schematic-chart';
import Img from './img';
import IndicatorLight from './indicator-light';
import IntelligenceReport from './intelligence-report';
import MultipleEnergyMonitoring from './multiple-energy-monitoring';
import OperationalAnalysis from './operational-analysis';
import OperationsAnalysis from './operations-analysis';
import Overlay from './overlay';
import Page from './page';
import Qrcode from './qrcode';
import RunningParameters from './running-parameters';
import SettingParameter from './setting-parameter';
import SystemCumulativeData from './system-cumulative-data';
import SystemDataCumulation from './system-data-cumulation';
import SystemOperatingParameters from './system-operating-parameters';
import Text from './text';
import TimeWeather from './time-weather';
import Video from './video';
import WarningRunningList from './warning-running-list';
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
  dynamicMonitoring: DynamicMonitoring,
  settingParameter: SettingParameter,
  systemOperatingParameters: SystemOperatingParameters,
  globalSchematic: GlobalSchematic,
  indicatorLight: IndicatorLight,
  warningRunningList: WarningRunningList,
  runningParameters: RunningParameters,
  energyEfficiencyMonitoring: EnergyEfficiencyMonitoring,
  timeWeather: TimeWeather,
  video: Video,
  globalSchematicChart: GlobalSchematicChart,
  multipleEnergyMonitoring: MultipleEnergyMonitoring,
  charts: Charts,
  equipmentCondition: EquipmentCondition,
  systemCumulativeData: SystemCumulativeData,
  equipmentOperatingParameter: EquipmentOperatingParameter,
  economicIndicators: EconomicIndicators,
  warningTableList: WarningTableList,
  equipmentQueryOperation: EquipmentQueryOperation,
  systemDataCumulation: SystemDataCumulation,
  operationalAnalysis: OperationalAnalysis,
  energyMonitoring: EnergyMonitoring,
  electricEnergyQuality: ElectricEnergyQuality,
  operationsAnalysis: OperationsAnalysis,
  intelligenceReport: IntelligenceReport,
};

export default ui;
