import { MComponent } from '@edoms/schema';

export interface MEfficiencyMonitoring {
  /** 实例类型 */
  instanceType: string;
  /** 实例 */
  instance: string;
  /** 属性类型 */
  propertyType: string;
  /** 属性 */
  property: string;
  /**最小值 */
  minValue: string;
  /**最大值 */
  maxValue: string;
  /**目标值 */
  targetValue: string;
  /**能效名称 */
  energyName: string;
  /** 精度 */
  precision: string;
  /** 单位 */
  unit: string;
}

export interface MEfficiencyConfigs extends MComponent {
  /**轮询间隔时间 */
  intervalDelay: number;
  monitorings: MEfficiencyMonitoring[];
  /**能效值颜色 */
  efficiencyColor: string;
  /**参考线颜色 */
  targetLineColor: string;
}

export interface EnergyEfficiency {
  /** 实例 */
  instance: string;
  /**最小值 */
  minValue: string;
  /**最大值 */
  maxValue: string;
  /**目标值 */
  targetValue: string;
  /**能效名称 */
  energyName: string;
  /**能效值 */
  efficiencyNum: string;
  /**百分比 */
  percentage: number;
  /** 目标值位置 */
  targetPosition: string;
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
  /** 能效监测值 */
  efficiencyNum: string;
}

export type FetchEfficiencyRes = EfficiencyData[];

export interface Apis {
  fetchEfficiencyData: (data: FetchEfficiencyReq) => Promise<FetchEfficiencyRes>;
}
