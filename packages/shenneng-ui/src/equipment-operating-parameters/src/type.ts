import { MComponent } from '@edoms/schema';

export interface MParameter {
  /** 参数名 */
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

export interface MEquitment {
  /** 设备名 */
  label: string;
  /** 实例类型 */
  instanceType: string;
  /** 实例 */
  instance: string;
  /** 属性类型 */
  propertyType: string;
  /** 属性 */
  property: string;
  /**参数 */
  parameters: MParameter[];
}

export interface MEquitmentType {
  /**设备类型 */
  label: string;
  /**设备 */
  equipments: MEquitment[];
}

export interface MParamenterConfig extends MComponent {
  /** 轮询间隔 */
  intervalDelay: number;
  /** 设备类型 */
  equipmentTypes: MEquitmentType[];
}

export interface OperationParamReqItem {
  /**设备实例Code */
  deviceCode: string;
  /**属性Code列表 */
  propCodeList: string[];
}

export interface OperationParamResItem {
  /**设备实例code */
  deviceCode: string;
  /**属性code */
  propCode: string;
  /**数据值 */
  dataValue: string;
}

export interface FetchOperationParamReq {
  dataList: OperationParamReqItem[];
}

export type FetchOperationParamRes = OperationParamResItem[];

export interface Apis {
  fetchOperationParameter: (data: FetchOperationParamReq) => Promise<FetchOperationParamRes>;
}
