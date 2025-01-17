import type { ModelCodeType, ModelPropType } from '@/const/model';
import { KVStruct } from '@/const/struct';

export interface ListInstanceReq {
  virtual: string;
  /** 设备编码 */
  deviceCode: string;
  /** 是否是查询设备 */
  isQueryDevice: boolean;
  /** 租戶id */
  dataCode: string;
}

export interface ListInstanceResItem {
  /** 实例编号 */
  insCode: string;
  /** 实例名称 */
  insName: string;
  /** 子实例 */
  children: ListInstanceResItem[];
  /** 是否可用 */
  disable: boolean;
  /** 实例类型 */
  type: ModelCodeType;
  [key: string]: any;
}

export type ListInstanceRes = ListInstanceResItem[];

export interface ListPointReq {
  /** 实例ID */
  insId?: string;
  /** 实例id 数字孪生 */
  insDataCode: string;
  /** 实例编码类型 */
  codeType: ModelCodeType;
  /** 属性类型 */
  propType: ModelPropType;
  /** 属性名称 */
  propName?: string;
}

export interface ListPointResItem {
  /** 点位标签 */
  label: string;
  /** 点位值 */
  value: string;
  /** 单位 */
  unit: string;
}

export type ListPointRes = ListPointResItem[];

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

export interface TableHistory {
  /** 记录ID */
  id: string;
  /** 文件名称 */
  fileName: string;
  /** 操作类型 */
  action: string;
  /** 操作状态 */
  status: string;
  /** 模型表ID */
  dicCimId: string;
  /** 操作人 */
  createBy: string;
  /** 操作时间 */
  createTime: string;
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
  [key: string]: any;
}
