import { MComponent } from '@edoms/schema';

export interface MIndicatorItemConfig {
  /** 指标标签 */
  label: string;
  /** 实例类型 */
  instanceType: string;
  /** 实例 */
  instance: string;
  /** 属性类型 */
  propertyType: string;
  /** 属性 */
  property: string;
  /** 单位 */
  unit: string;
  /** 精度 */
  precision: string;
  /** 对应的指标值 */
  value?: string;
}

export interface MConditionItemConfig {
  /** 设备标签 */
  label: string;
  /** 参数颜色 */
  color: string;
  /** 曲线颜色 */
  lineColor: string;
  /** 设备归属 */
  group: string;
  /** 参数指标 */
  indicators: MIndicatorItemConfig[];
}

export interface MEquipmentGroup {
  group: string;
}

export interface MEquipmentCondition extends MComponent {
  /** 标题 */
  title: string;
  /** 轮询间隔 */
  intervalDelay: number;
  /** 分组标签 */
  groups: MEquipmentGroup[];
  /** 工况 */
  conditions: MConditionItemConfig[];
}

export interface HistoryParameterItem {
  /** 设备实例Code */
  deviceCode: string;
  /** 属性Code */
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
    value: string;
  }>;
}

export type FetchHistoryDataRes = HistoryData[];

export interface ParameterItem {
  /** 设备实例code */
  deviceCode: string;
  /** 属性code列表 */
  propCodeList: string[];
}

export interface FetchRealTimeDataReq {
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

export interface RealData {
  propCode: string;
  propVal: number;
}

export interface FetchRealDataReq {
  dataCodes: string[];
}

export type FetchRealTimeDataRes = IndicatorDataItem[];
export type FetchRealDataRes = RealData[];

export interface Apis {
  fetchHistoryData: (data: FetchHistoryDataReq) => Promise<FetchHistoryDataRes>;
  fetchRealData: (data: FetchRealDataReq) => Promise<FetchRealDataRes>;
}
