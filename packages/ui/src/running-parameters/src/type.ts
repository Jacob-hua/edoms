import { MComponent } from '@edoms/schema';

export interface MIndicatorItemConfig {
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
  /** 展示颜色 */
  color: string;
}

export interface MParameterItemConfig {
  /** 标签 */
  label: string;
  /** 指标 */
  indicators: MIndicatorItemConfig[];
}

export interface MRunningParameters extends MComponent {
  /** 轮询间隔 */
  intervalDelay: number;
  /** 系统曲线 */
  systems: MParameterItemConfig[];
  /** 设备曲线 */
  equipments: MParameterItemConfig[];
}

export interface ParameterItem {
  /** 设备实例code */
  deviceCode: string;
  /** 属性code列表 */
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
  dataList: ParameterItem[];
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

export interface Apis {
  fetchHistoryData: (data: FetchHistoryDataReq) => Promise<FetchHistoryDataRes>;
}
