export interface InstanceItem {
  insCode: string;
  insName: string;
  children: InstanceItem[];
  disable: boolean;
  type: string;
  [key: string]: any;
}

export interface ListInstanceReq {
  virtual: string;
  deviceCode: string;
  isQueryDevice: boolean;
}
