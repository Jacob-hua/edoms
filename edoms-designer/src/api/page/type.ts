export interface PageInfo {
  /** 页面ID */
  pageId: number;
  /** 页面名称 */
  name: string;
  /** 创建者 */
  createBy: string;
  /** 创建事件 */
  createTime: string;
  label: number;
}

export interface ListPageInfosReq {
  /** 页面名称 */
  name: string | null;
  /** 应用ID */
  applicationId: string;
  /** 页码 */
  page: number;
  /** 页面大小 */
  limit: number;
}

export interface ListPageInfosRes {
  /** 总记录数 */
  count: number;
  /** 页面大小 */
  limit: number;
  /** 页码 */
  page: number;
  /** 数据列表 */
  dataList: PageInfo[];
}

export interface CreatePageReq {
  name: string;
  applicationId: string;
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
