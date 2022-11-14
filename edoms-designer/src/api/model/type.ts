import type { ModelCodeType, ModelPropType } from '@/const/model';

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

export interface PointItem {
  label: string;
  code: string;
}

export interface ListPointReq {
  insId: string;
  codeType: ModelCodeType;
  propType: ModelPropType;
}
