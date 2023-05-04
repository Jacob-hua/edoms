import { MComponent } from '@edoms/schema';

export enum MEconomicIndicator {
  /** 电费 */
  ELECTRIC = 'electric',
  /** 用电量 */
  ELECTRICITY_CONSUMPTION = 'consumption',
  /** 单位制冷成本 */
  COOL_COST = 'cost',
  /** 单位制冷能耗 */
  ENERGY_CONSUMPTION = 'energy',
}

export interface ThresholdConfig {
  //**阈值最小值 */
  minValue: number;
  /**阈值最大值 */
  maxValue: number;
  /**告警等级 */
  alarmLevel: string;
  /**颜色 */
  alarmColor: string;
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
  /**阈值配置 */
  thresholdConfigs: ThresholdConfig[];
  /** 精度 */
  precision: string;
  /** 单位 */
  unit: string;
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

export type FetchHistoryDataRes = HistoryData[];

export type FetchEnvMonitoringRes = IndicatorDataItem[];

export interface Apis {
  fetchIndicatorData: (data: FetchEnvMonitoringReq) => Promise<FetchEnvMonitoringRes>;
  fetchHistoryData: (data: FetchHistoryDataReq) => Promise<FetchHistoryDataRes>;
}
