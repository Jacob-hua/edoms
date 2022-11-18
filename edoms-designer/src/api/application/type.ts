export interface ApplicationInfo {
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

export interface ListApplicationsReq {
  /** 页码 */
  page: number;
  /** 页面大小 */
  limit: number;
}

export interface ListApplicationsRes {
  /** 总记录数 */
  count: string;
  /** 页面大小 */
  limit: string;
  /** 页码 */
  page: string;
  /** 数据列表 */
  dataList: ApplicationInfo[];
}

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
  applicationId: number | null;
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

export interface GetApplicationInfoReq {
  /** 应用ID */
  applicationId: string;
}

export type GetApplicationInfoRes = ApplicationInfo;

export interface DeleteApplicationReq {
  /** 应用ID */
  applicationId: string;
  /** 确认字符 */
  secret: string;
}
