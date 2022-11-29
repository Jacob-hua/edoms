import { PageStruct } from '@/const/struct';

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

export type ListApplicationsRes = PageStruct<ApplicationInfo>;

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

export interface GetApplicationReq {
  /** 应用ID */
  applicationId: string;
}

export type GetApplicationRes = ApplicationInfo;

export interface DeleteApplicationReq {
  /** 应用ID */
  applicationId: string;
  /** 确认字符 */
  secret: string;
}
