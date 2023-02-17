import { MComponent } from '@edoms/schema';

export interface ThresholdConfig {
  /**阈值最小值 */
  minValue: number;
  /**阈值最大值 */
  maxValue: number;
  /**告警等级 */
  alarmLevel: string;
  /**颜色 */
  alarmColor: string;
}

export interface MIndicatorItemConfig {
  /** 指标标签 */
  label: string;
  /** 曲线颜色 */
  lineColor: string;
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
  /**阈值配置 */
  thresholdConfigs: ThresholdConfig[];
}

export interface MConditionItemConfig {
  /** 设备标签 */
  label: string;
  /** 参数颜色 */
  color: string;
  /** 设备归属 */
  group: string;
  /** 参数指标 */
  indicators: MIndicatorItemConfig[];
}

export interface MEquipmentCondition extends MComponent {
  /** 轮询间隔 */
  intervalDelay: number;
  /** 工况 */
  conditions: MIndicatorItemConfig[];
}
