import { MComponent } from '@edoms/schema';

export interface ImgItem {
  src: string;
  alt: string;
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
}

export interface MCarousel extends MComponent {
  imgs: any[];
  intervalDelay: number;
  indicators: MIndicatorItemConfig[];
}
