/*
 * @Description:
 * @Author: lihao
 * @Date: 2023-04-27 10:04:26
 * @LastEditors: lihao
 * @LastEditTime: 2023-05-09 08:47:54
 */
import { MComponent } from '@edoms/schema';

export interface MQueryForm {
  /** 当前时间 */
  date: string;
  /** 楼 */
  building: string;
  /** 室 */
  room: string;
  /** 起始时间 */
  startDate?: string;
  /** 结束时间 */
  endDate?: string;
  /** 室外最小温度 */
  minTem?: string;
  /** 室外最大温度 */
  maxTem?: string;
  /** 目标最小湿度 */
  minTargetHumidity?: string;
  /** 目标最大湿度 */
  maxTargetHumidity?: string;
}

export interface MTableQueryForm {
  date: string;
  range: string;
}

export interface MIntelligenceReport extends MComponent {
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
  /** 标题 */
  title: string;
  buildings: any[];
  tableData: any[];
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
  /** 属性Code */
  propCode: string;
}

export interface HistoryParameterItem {
  /** 设备实例code */
  insCode: string;
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
