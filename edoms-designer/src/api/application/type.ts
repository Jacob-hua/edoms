import { PageStruct } from '@/const/struct';

export interface ListApplicationsReq {
  /** 页码 */
  page: number;
  /** 页面大小 */
  limit: number;
}

export interface ListApplicationsResItem {
  /** 应用ID */
  applicationId: string;
  /** 应用名称 */
  name: string;
  /** 应用缩略图 */
  thumbnailId?: string;
  /** 应用简介 */
  description: string;
  /** 预览地址 */
  serviceAddress: string;
  /** 租户ID */
  tenantId: string;
  /** 创建者 */
  createBy: string;
  /** 创建时间 */
  createTime: string;
  [key: string]: any;
}

export type ListApplicationsRes = PageStruct<ListApplicationsResItem>;

export interface CreateApplicationReq {
  /** 应用名称 */
  name: string;
  /** 应用简介 */
  description: string;
  /** 缩略图 */
  thumbnailId?: string | null;
}

export interface CreateApplicationRes {
  /** 应用ID */
  applicationId: string;
  /** 版本ID */
  versionId: string;
}

export interface UpdateApplicationReq {
  /** 应用ID */
  applicationId: string;
  /** 应用名称 */
  name: string;
  /** 应用简介 */
  description: string;
  /** 缩略图 */
  thumbnailId?: string | null;
  /** 服务地址 */
  serviceAddress?: string | null;
}

export interface GetApplicationReq {
  /** 应用ID */
  applicationId: string;
}

export interface GetApplicationRes {
  /** 应用ID */
  applicationId: string;
  /** 应用名称 */
  name: string;
  /** 应用缩略图 */
  thumbnailId?: string;
  /** 应用简介 */
  description: string;
  /** 预览地址 */
  serviceAddress: string;
  /** 租户ID */
  tenantId: string;
  /** 创建者 */
  createBy: string;
  /** 创建时间 */
  createTime: string;
  /** 删除密钥 */
  secret: string;
  /** 默认版本ID */
  defaultVersionId: string;
  /** 默认版本名称 */
  defaultVersionName: string;
  /** 默认版本内容ID */
  defaultVersionContentId: string;
  /** 应用角色 */
  edomsRoleInfoDTO: {
    /** 角色ID */
    roleId: string;
    /** 角色Key */
    roleKey: string;
    /** 角色名称 */
    roleName: string;
  };
}

export interface DeleteApplicationReq {
  /** 应用ID */
  applicationId: string;
  /** 确认字符 */
  secret: string;
}

export interface PreviewApplicationReq {
  /** 服务地址 */
  serviceAddress: string;
  /** 版本ID */
  versionId?: string;
}

export interface ExportApplicationReq {
  /** 应用ID */
  applicationId: string;
  /** 版本ID */
  versionId: string;
}

export interface UpdateDefaultVersionReq {
  /** 应用ID */
  applicationId: string;
  /** 版本ID */
  versionId: string;
}

export interface Parameter {
  /** 参数名称 **/
  propName: string;
  /** 参数值 **/
  propValue: string;
  /** 参数单位 **/
  propUnit: string;
}

export interface ParameterList {
  /**组件类型 */
  componentType: string;
  /**组件唯一标识 */
  componentIdentify: string;
  /**参数列表 */
  dataSetting: Parameter[];
}

export interface SaveParametrReq {
  /**应用ID */
  applicationId: string;
  /** 租户ID */
  tenantId: string;
  /**数据列表 */
  list: ParameterList[];
}
