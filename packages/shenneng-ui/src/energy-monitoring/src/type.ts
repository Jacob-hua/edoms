import { MComponent } from '@edoms/schema';

export interface MParameterItemConfig {
  /** 最小值 */
  minValue: string;
  /** 最大值 */
  maxValue: string;
  /** 颜色 */
  color: string;
}

export interface MEnergyMonitoring extends MComponent {
  /** 实例类型 */
  instanceType: string;
  /** 能效名称 */
  energyName: string;
  /** 子标题 */
  title: string;
  /** 子标题 */
  subTitle: string;
  /** 实例 */
  instance: string;
  /**最小值 */
  minValue: string;
  /**最大值 */
  maxValue: string;
  /**等分数量 */
  bisectionNumber: number;
  /**游标颜色 */
  cursorColor: string;
  /** 精度 */
  precision: string;
  /** 单位 */
  unit: string;
  /**轮询间隔时间 */
  intervalDelay: number;
  excellent: MParameterItemConfig[];
  good: MParameterItemConfig[];
  medium: MParameterItemConfig[];
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

export type FetchHistoryDataRes = HistoryData[];

export type FetchEfficiencyRes = EfficiencyData[];

export interface Apis {
  fetchEfficiencyData: (data: FetchEfficiencyReq) => Promise<FetchEfficiencyRes>;
  fetchHistoryData: (data: FetchHistoryDataReq) => Promise<FetchHistoryDataRes>;
}
