import { MComponent } from '@edoms/schema';

export interface MParameterItemConfig {
  /** 颜色 */
  color: string;
}

export interface voltageAnalysis {
  instance: string[];
}

export interface ElectricEnergyQuality extends MComponent {
  /** 标题 */
  title: string;
  /** 实例类型 */
  instanceType: string;

  /** 实例 */
  instance: string;

  /** 精度 */
  precision: string;
  /** 单位 */
  unit: string;
  /**轮询间隔时间 */
  intervalDelay: number;
  /**考核基准 */
  examine: number;
  /**三相电流颜色 */
  currentLa: string;
  currentLb: string;
  currentLc: string;
  /**负载率 三相不平衡率颜色 */
  loadRate: string;
  threePhasRate: string;
  proportion: MParameterItemConfig[];
  voltageAnalysis: voltageAnalysis[];
}

export interface FetchEfficiencyReq {
  /** 实例code列表 */
  insCodeList: string[];
  /** 属性code */
  propCode: string;
}

export interface EfficiencyData {
  /** 实例编码 */
  insCode: string;
  /** 能效监测值 */
  efficiencyNum: string;
}

export interface HistoryParameterItem {
  /** 设备实例code */
  deviceCode: string;
  /** 属性code */
  propCode: string;
}

export interface FetchHistoryDataReq {
  /** 开始时间 */
  startTime: string;
  /** 结束时间 */
  endTime: string;
  /** 时间间隔 */
  interval: string;
  /** 类型 */
  type: string;
  /** 属性数据 */
  dataList: HistoryParameterItem[];
}

export interface HistoryData {
  /** 实例Code */
  insCode: string;
  /** 属性Code */
  propCode: string;
  /** 数据列表 */
  dataList: Array<{
    /** 时间 */
    time: string;
    /** 数值 */
    value: string;
  }>;
}

export interface VoltagAnallysisChart {
  seriesData: Array<number>;
  xaxisData: Array<string>;
}

export interface FetchVoltagAnallysisRes {
  histogram: VoltagAnallysisChart;
  underVoltage: Array<number>;
  overVoltage: Array<number>;
  voltageFluctuation: Array<number>;
}

export type FetchHistoryDataRes = HistoryData[];

export type FetchEfficiencyRes = EfficiencyData[];

export interface FetchVoltageAnalysisReq {
  devCode: string;
  time: string;
  queryType: string;
}

export interface FetchExecuteApiReq {
  apiCode: string;
  requestParam: FetchVoltageAnalysisReq;
}

export interface FactorDataReq {
  devInsCode: string;
  startTime: string;
  endTime: string;
  interval?: string;
}

export interface FetchFactorDataReq {
  apiCode: string;
  requestParam: FactorDataReq;
}

export interface Apis {
  fetchEfficiencyData: (data: FetchEfficiencyReq) => Promise<FetchEfficiencyRes>;
  fetchHistoryData: (data: FetchHistoryDataReq) => Promise<FetchHistoryDataRes>;
  fetchExecuteApi: (data: FetchExecuteApiReq) => Promise<FetchVoltagAnallysisRes>;
  fetchFactorDay: (data: FetchFactorDataReq) => Promise<[]>;
  fetchFactorWeek: (data: FetchFactorDataReq) => Promise<[]>;
  fetchFactorLoad: (data: FetchFactorDataReq) => Promise<[]>;
}
