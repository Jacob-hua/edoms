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
  value: string;
  unit: string;
}

export interface ListPointReq {
  insId: string;
  codeType: ModelCodeType;
  propType: ModelPropType;
  propName?: string;
}
export interface GetDicReq {
  mark: string;
}

export interface Dic {
  id: number;
  name: string;
  value: string;
  sort: string;
  remark: string;
}

export interface GetDicRes {
  dataList: Dic[];
}

export interface GetModelTypeRes {
  modelTypeId: number | null;
  modelType: string | null;
}

export interface TableHistoryReq {
  page: number;
  limit: number;
  action?: string;
  tableId: number;
}
export interface Table {
  id: string;
  fileName: string;
  createBy: string;
  action: string;
  dicCimId: string;
  createTime: string | any;
}

export interface TableHistoryRes {
  page: string;
  limit: string;
  count: string;
  dataList: Table[];
}

export interface ClearTableReq {
  tableId: number;
}

export interface ClearTableRes {
  result: string | null;
}

export interface ExportTableReq {
  tableId: number;
}

export interface ExportTableRes {
  result: any;
}

export interface ImportFile {
  result: string | null;
}

export interface SaveApiReq {
  id?: string | null;
  path: string;
  method: string;
  dicCimId?: number;
  params: any[];
  body: any[];
  header: any[];
  cookie: any[];
}

export interface SaveApiRes {
  result: any;
}

export interface ExportOperationRecordReq {
  dicCimId: number;
}

export interface GetTableApiReq {
  applicationId?: number;
  dicCimId: number;
}
export interface GetTableApiRes {
  body: any[];
  cookie: any[];
  dicCimId: string;
  header: any[];
  id: string;
  method: string;
  params: any[];
  path: string;
}
