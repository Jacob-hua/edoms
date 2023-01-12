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
}

export interface DeleteApplicationReq {
  /** 应用ID */
  applicationId: string;
  /** 确认字符 */
  secret: string;
}

export interface ReleaseApplicationReq {
  /** 应用ID */
  applicationId: string;
}

export interface GetReleaseIdReq {
  /** 服务地址 */
  serviceAddress: string;
}

export interface ExportApplicationReq {
  /** 应用ID */
  applicationId: string;
}
