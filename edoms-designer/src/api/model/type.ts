import { UploadRawFile } from 'element-plus';

import type { ModelCodeType, ModelPropType, ModelTableActionType } from '@/const/model';
import { KVStruct, PageStruct } from '@/const/struct';

export interface ListInstanceReq {
  virtual: string;
  /** 设备编码 */
  deviceCode: string;
  /** 是否是查询设备 */
  isQueryDevice: boolean;
}

export interface InstanceItem {
  /** 实例编号 */
  insCode: string;
  /** 实例名称 */
  insName: string;
  /** 子实例 */
  children: InstanceItem[];
  /** 是否可用 */
  disable: boolean;
  /** 实例类型 */
  type: ModelCodeType;
  [key: string]: any;
}

export type ListInstanceRes = InstanceItem[];

export interface ListPointReq {
  /** 实例ID */
  insId: string;
  /** 实例编码类型 */
  codeType: ModelCodeType;
  /** 属性类型 */
  propType: ModelPropType;
  /** 属性名称 */
  propName?: string;
}

export interface PointItem {
  /** 点位标签 */
  label: string;
  /** 点位值 */
  value: string;
  /** 单位 */
  unit: string;
}

export type ListPointRes = PointItem[];

export interface GetDicReq {
  /** 字典标识 */
  mark: string;
}

export interface Dic {
  /** 字典ID */
  id: number;
  /** 字典名称 */
  name: string;
  /** 字典值 */
  value: string;
  /** 字典序号 */
  sort: string;
  /** 备注 */
  remark: string;
}

export type GetDicRes = Dic[];

export interface GetModelTypeRes {
  /** 模型类型ID */
  modelTypeId: number;
  /** 模型类型 */
  modelType: string;
}

export interface TableHistoryReq {
  /** 页码 */
  page: number;
  /** 页面大小 */
  limit: number;
  /** 操作类型 */
  action?: string;
  /** 表ID */
  tableId: number;
}

export interface TableHistory {
  /** 记录ID */
  id: string;
  /** 文件名称 */
  fileName: string;
  /** 操作类型 */
  action: ModelTableActionType;
  /** 模型表ID */
  dicCimId: string;
  /** 操作人 */
  createBy: string;
  /** 操作时间 */
  createTime: string;
}

export type TableHistoryRes = PageStruct<TableHistory>;

export interface UpdateModelTypeReq {
  /** 记录ID **/
  modelTypeId: number;
  /** 模型类型 **/
  modelType: string;
}

export interface ClearTableReq {
  /** 表ID */
  tableId: number;
}

export interface ExportTableReq {
  /** 表ID */
  tableId: number;
}

export interface ImportTableReq {
  /** 文件流 */
  file: UploadRawFile;
  /** 表id */
  tableId: string;
  /** 文件名称 */
  fileName: string;
}

export interface ApiStruct {
  /** 更新api详情记录ID **/
  id?: number;
  /** API字典表ID */
  dicCimId?: number;
  /** API路径 */
  path: string;
  /** API方法 */
  method: string;
  /** 请求参数 */
  params: KVStruct[];
  /** 请求体 */
  body: KVStruct[];
  /** 请求头 */
  header: KVStruct[];
  /** 请求cookie */
  cookie: KVStruct[];
}

export type SaveApiReq = ApiStruct;

export interface ExportTableHistoryReq {
  /** 模型字典ID */
  dicCimId: number;
}

export interface GetApiReq {
  /** 模型字典ID */
  dicCimId: number;
}

export type GetApiRes = ApiStruct;

export type SimulationApiReq = ApiStruct;
