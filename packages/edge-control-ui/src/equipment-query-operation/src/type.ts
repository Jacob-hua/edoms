import { MComponent } from '@edoms/schema';

export interface QueryList {
  queryUnit: string;
  queryName: string;
  queryApi?: string;
  precision: string;
  color: string;
  [key: string]: any;
}

export interface EqData {
  [x: string]: any;
  eqCode: string;
  eqName: string;
  pointList?: Array<QueryList>;
}

export interface EqAllList {
  [x: string]: any;
  group: string;
}

export interface EqDataList extends MComponent {
  /** 标题 */
  title: string;
  /** 子标题 */
  subTitle: string;
  /** 轮询间隔 */
  intervalDelay: number;
  /** 设备类型 */
  deviceGroup: Array<EqAllList>;
  equipmentList: Array<EqData>;
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
}
