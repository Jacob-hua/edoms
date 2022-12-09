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
}

export interface MGlobalSchematic extends MComponent {
  intervalDelay: number;
  src: string;
  indicators: MIndicatorItemConfig[];
}

export interface ParameterItem {
  /** 设备实例code */
  deviceCode: string;
  /** 属性code列表 */
  propCodeList: string[];
}

export interface FetchGlobSchematicReq {
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

export type FetchGlobSchematicRes = IndicatorDataItem[];

export interface Apis {
  fetchIndicatorData: (data: FetchGlobSchematicReq) => Promise<FetchGlobSchematicRes>;
}

export type IndicatorData = Record<string, number>;
