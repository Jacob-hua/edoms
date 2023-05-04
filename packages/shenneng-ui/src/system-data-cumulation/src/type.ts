import { MComponent } from '@edoms/schema';

export interface Variable {
  /** 变量名 */
  variable: string;
  /** 实例类型 */
  instanceType: string;
  /** 实例 */
  instance: string;
  /** 属性类型 */
  propertyType: string;
  /** 属性 */
  property: string;
}

export interface Category {
  /** 类别名 */
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
  /** 比率精度 */
  ratioPrecision: string;
  /** 单位 */
  unit: string;
  /** 变量列表 */
  variables: Variable[];
  /** 表达式 */
  expression: string;
  /** 比例计算方式 */
  calculateType: string;
}

export interface MCumulativeConfig extends MComponent {
  /**轮询间隔时间 */
  intervalDelay: number;
  /** 累计列表 */
  category: Category[];
}

export interface CumulativeDataReq {
  /** 时间计算范围 */
  dateRange: string;
  /** 比例计算方式 */
  calculateType: string;
  /** 数据标识 */
  identify: string;
  /** 数据参数 */
  variables: any;
  /** 计算公式 */
  expression: string;
  /** 实例Code */
  insCode: string;
  /** 属性Code */
  propCode: string;
  /** 实例类型 */
  type: string;
}

export interface CumulativeDataRes {
  /**数据标识 */
  identify: string;
  /** 当前值 */
  dataValue: string;
  /**环比比例 */
  momRatio: string;
  /** 环比趋势 */
  momTrend: 'up' | 'down' | 'flat';
  /** 同比比例 */
  yoyRatio: string;
  /** 同比趋势 */
  yoyTrend: 'up' | 'down' | 'flat';
}

export interface FetchHistoryDataReq {
  /** 时间计算范围 */
  dateRange: string;
  /** 数据参数 */
  variables: any;
  /** 计算公式 */
  expression: string;
  /** 实例Code */
  insCode: string;
  /** 属性Code */
  propCode: string;
  /** 实例类型 */
  type: string;
}

export interface FetchHistoryDataItem {
  time: string;
  value: string;
}

export type FetchHistoryDataRes = FetchHistoryDataItem[];

export type FetchCumulativeDataReq = CumulativeDataReq[];
export type FetchCumulativeDataRes = CumulativeDataRes[];

export interface Apis {
  fetchCumulativeData: (data: FetchCumulativeDataReq) => Promise<FetchCumulativeDataRes>;
  fetchHistoryData: (data: FetchHistoryDataReq) => Promise<FetchHistoryDataRes>;
}
