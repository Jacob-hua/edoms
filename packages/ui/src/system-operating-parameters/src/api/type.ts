export interface ParameterItem {
  /** 设备实例code */
  deviceCode: string;
  /** 属性code列表 */
  propCodeList: string[];
}

export interface FetchParameterReq {
  /** 属性数据 */
  dataList: ParameterItem[];
}

export interface ParametersDataItem {
  /** 数据值 */
  dataValue: number;
  /** 属性code */
  propCode: string;
  /** 设备code */
  deviceCode: string;
}

export type FetchParameterRes = ParametersDataItem[];
