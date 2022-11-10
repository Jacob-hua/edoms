export interface PageInfo {
  pageId: number;
  name: string;
  createBy: string;
  createTime: string;
  label: number;
}

export interface ListPageInfosReq {
  name: string | null;
  page: number;
  limit: number;
  applicationId: string;
}

export interface ListPageInfosRes {
  count: string;
  limit: string;
  page: string;
  dataList: PageInfo[];
}

export interface CreatePageReq {
  name: string;
  applicationId: string;
  description?: string;
}

export interface CreatePageRes {
  result: {
    pageId: string | null;
  };
}

export interface UpdatePageReq {
  pageId: number;
  name: string;
  description?: string;
  applicationId: string;
}

export interface UpdatePageRes {
  result: string;
}

export interface DeletePageReq {
  pageIds: bigint[];
}

export interface DeletePageRes {
  result: string;
}
