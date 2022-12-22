import { MComponent } from '@edoms/schema';

export interface MParameterItemConfig {
  /** 标签 */
  label: string;
  /** 参数名称 */
  name: string;
  /** 展示颜色 */
  color: string;
}

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
  /** 参数 */
  parameters: MParameterItemConfig[];
}

export interface MRunningParameters extends MComponent {
  /** 轮询间隔 */
  intervalDelay: number;
  /** 系统曲线 */
  systems: MIndicatorItemConfig[];
  /** 设备曲线 */
  equipments: MIndicatorItemConfig[];
}
