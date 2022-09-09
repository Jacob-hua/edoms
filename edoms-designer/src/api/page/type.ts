export interface PageInfo {
  pageId: number
  name: string
  createBy: string
  createTime: string
  label: number
}

export interface ListPageInfosReq {
  page: number
  limit: number
  applicationId: string
}

export interface ListPageInfosRes {
  count: string
  limit: string
  page: string
  dataList: PageInfo[]
}
