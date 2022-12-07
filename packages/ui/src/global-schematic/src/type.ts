export interface MGlobalSchematicIndicatorItemConfig {
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
}

export interface MGlobalSchematic {
  intervalDelay: number;
  src: string;
  indicators: MGlobalSchematicIndicatorItemConfig[];
}
