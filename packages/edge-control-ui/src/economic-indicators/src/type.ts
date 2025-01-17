import { MComponent } from '@edoms/schema';

export enum MEconomicIndicator {
  /** 电费 */
  ELECTRIC = 'eletric',
  /** 用电量 */
  ELECTRICITY_CONSUMPTION = 'consumption',
  /** 制冷成本 */
  COLD_COST = 'cost',
  /** 制冷量 */
  REFRIGERATION_CAPACITY = 'refrigeration',
}

export interface MIndicatorItemConfig {
  /** 监测指标 */
  type: MEconomicIndicator;
  /** 标签 */
  label: string;
  /** 实例类型 */
  instanceType: string;
  /** 实例 */
  instance: string;
  /** 属性类型 */
  propertyType: string;
  /** 属性 */
  property: string;
  /** 精度 */
  precision: string;
  /** 单位 */
  unit: string;
  /** 指标code */
  code: string;
}

export interface MEconomicIndicators extends MComponent {
  visibleNumber: number;
  intervalDelay: number;
  /** 标题 */
  title: string;
  /** 子标题 */
  subTitle: string;
  indicators: MIndicatorItemConfig[];
}

export interface ParameterItem {
  /** 设备实例code */
  deviceCode: string;
  /** 属性code列表 */
  propCodeList: string[];
}

export interface FetchEnvMonitoringReq {
  /** 属性数据 */
  dataList: ParameterItem[];
}

export interface IndicatorDataItem {
  /** 数据值 */
  dataValue: number;
  /** 属性code */
  propCode: string;
  /** 设备code */
  deviceCode: string;
}

export interface historyParameterItem {
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
  dataList: historyParameterItem[];
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

/**
 * 深能接口定义
 */

export interface FetchCumulativeDataReq {
  calcType: string;
  dataCodes: string[];
  endTime: number;
  startTime: number;
}

export interface FetchRealDataReq {
  dataCodes: string[];
}

export interface CumulativeData {
  propCode: string;
  propValue: string;
}

export interface RealData {
  propCode: string;
  propVal: string;
}

export interface FetchCurveDataReq {
  dataCodes: string[];
  endTime: string;
  startTime: string;
  ts: string;
  tsUnit: string;
}

export interface CurveData {
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

interface ExecuteApiParams {
  codes: string;
  time: string;
}

export interface FetchExecuteApiReq {
  apiCode: string;
  requestParam: ExecuteApiParams;
}

export type fetchExecuteApiRes = Record<string, number>;

export type FetchHistoryDataRes = HistoryData[];

export type FetchEnvMonitoringRes = IndicatorDataItem[];

export type FetchRealDataRes = RealData[];

export type FetchCumulativeDataRes = CumulativeData[];

export type FetchCurveDataRes = CurveData[];

export interface Apis {
  fetchIndicatorData: (data: FetchEnvMonitoringReq) => Promise<FetchEnvMonitoringRes>;
  fetchHistoryData: (data: FetchHistoryDataReq) => Promise<FetchHistoryDataRes>;
  fetchCumulativeData: (data: FetchCumulativeDataReq) => Promise<FetchCumulativeDataRes>;
  fetchRealData: (data: FetchRealDataReq) => Promise<FetchRealDataRes>;
  fetchCurveData: (data: FetchCurveDataReq) => Promise<FetchCurveDataRes>;
  fetchExecuteApi: (data: FetchExecuteApiReq) => Promise<fetchExecuteApiRes>;
}
