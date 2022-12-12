import { MComponent } from '@edoms/schema';

export enum MEnvironmentIndicator {
  /** 温度 */
  TEMPERATURE = 'temperature',
  /** 湿度 */
  MOISTURE = 'moisture',
  /** 液体深度 */
  LIQUID_DEPTH = 'liquidDepth',
  /** 气体 */
  GAS = 'gas',
}

export interface MIndicatorItemConfig {
  /** 监测指标 */
  type: MEnvironmentIndicator;
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
  /** 预期最大阈值 */
  expectedMax: number;
  /** 预期最小阈值 */
  expectedMin: number;
  /** 目标最大阈值 */
  targetMax: number;
  /** 目标最小阈值 */
  targetMin: number;
  /** 精度 */
  precision: string;
  /** 单位 */
  unit: string;
}

export interface MDynamicMonitoring extends MComponent {
  visibleNumber: number;
  intervalDelay: number;
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

export type FetchEnvMonitoringRes = IndicatorDataItem[];

export interface Apis {
  fetchIndicatorData: (data: FetchEnvMonitoringReq) => Promise<FetchEnvMonitoringRes>;
}
