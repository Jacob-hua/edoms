import { PageStruct } from '@/const/struct';

export interface GetPageReq {
  /** 页面ID */
  pageId: string;
}

export interface GetPageRes {
  /** 应用ID */
  applicationId: string;
  /** 应用名称 */
  applicationName: string;
  /** 页面ID */
  pageId: string;
  /** 页面名称 */
  pageName: string;
  /** 编辑内容ID */
  editContentId: string | null;
}

export interface ListPageReq {
  /** 页面名称 */
  name: string | null;
  /** 应用ID */
  applicationId: string;
  /** 页码 */
  page: number;
  /** 页面大小 */
  limit: number;
}

export interface ListPageRes
  extends PageStruct<{
    /** 页面ID */
    pageId: number;
    /** 页面名称 */
    name: string;
    /** 页面内容ID */
    pushContentId: string;
    /** 创建者 */
    createBy: string;
    /** 创建时间 */
    createTime: string;
  }> {
  /** 应用名称 */
  applicationName: string;
  /** 应用ID */
  applicationId: string;
}

export interface CreatePageReq {
  /** 页面名称 */
  name: string;
  /** 应用Id */
  applicationId: string;
  /** 页面说明 */
  description?: string;
}

export interface CreatePageRes {
  /** 页面ID */
  pageId: number;
}

export interface UpdatePageReq {
  /** 页面ID */
  pageId: number;
  /** 页面名称 */
  name: string;
  /** 应用ID */
  applicationId: string;
  /** 页面简介 */
  description?: string;
}

export interface DeletePageReq {
  /** 应用ID集合 */
  pageIds: number[];
}
