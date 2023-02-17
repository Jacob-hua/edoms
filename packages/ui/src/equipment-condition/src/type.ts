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
  /** 轮询间隔 */
  intervalDelay: number;
  /** 分组标签 */
  groups: MEquipmentGroup[];
  /** 工况 */
  conditions: MConditionItemConfig[];
}
