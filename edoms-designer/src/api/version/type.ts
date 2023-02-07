import { PageStruct } from '@/const/struct';

export interface ListVersionsReq {
  /** 应用ID */
  applicationId: string;
  /** 页码 */
  page: number;
  /** 页面大小 */
  limit: number;
  /** 版本名称（筛选条件） */
  name?: string;
}

export interface ListVersionResItem {
  /** 版本ID */
  versionId: string;
  /** 版本名称 */
  name: string;
  /** 版本描述 */
  description: string;
  /** 版本内容ID */
  contentId: string;
  /** 创建者 */
  createBy: string;
  /** 创建时间 */
  createTime: number;
  /** 更新者 */
  updateBy: string;
  /** 更新时间 */
  updateTime: number;
}

export interface ListVersionsRes extends PageStruct<ListVersionResItem> {
  /** 应用ID */
  applicationId: string;
  /** 应用名称 */
  applicationName: string;
}

export interface GetVersionReq {
  /** 版本Id */
  versionId: string;
}

export interface GetVersionRes {
  /** 应用ID */
  applicationId: string;
  /** 应用名称 */
  applicationName: string;
  /** 版本ID */
  versionId: string;
  /** 版本名称 */
  name: string;
  /** 版本描述 */
  description: string;
  /** 版本内容ID */
  contentId?: string;
  /** 创建者 */
  createBy: string;
  /** 创建时间 */
  createTime: number;
  /** 更新者 */
  updateBy: string;
  /** 更新时间 */
  updateTime: number;
}

export interface UpdateVersionReq {
  /** 应用ID */
  applicationId: string;
  /** 版本ID */
  versionId: string;
  /** 版本名称 */
  name: string;
  /** 版本描述 */
  description: string;
}

export interface SaveVersionReq {
  /** 应用ID */
  applicationId: string;
  /** 版本名称 */
  name: string;
  /** 版本描述 */
  description: string;
  /** 内容ID */
  contentId?: string;
}

export interface DeleteVersion {
  /** 版本ID集合 */
  versionIds: string[];
  /** 应用ID */
  applicationId: string;
}

export interface Parameter {
  /** 参数名称 **/
  name: string;
  /** 参数值 **/
  value: string;
  /** 参数单位 **/
  unit: string;
}

export interface ParameterList {
  /**组件类型 */
  componentType: string;
  /**组件唯一标识 */
  componentIdentify: string;
  /**参数列表 */
  dataList: Parameter[];
}

export interface UpdateContentReq {
  /** 应用ID */
  applicationId: string;
  /** 版本ID */
  versionId: string;
  /** 内容Id */
  contentId: string;
  /** 组件列表 */
  list?: ParameterList[];
}
