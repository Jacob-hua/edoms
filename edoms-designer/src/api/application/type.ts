export interface ApplictionInfo {
  applicationId: string
  name: string
  createBy: string
  createTime: string
}

export interface ListApplicationsReq {
  page: number
  limit: number
}

export interface ListApplicationsRes {
  count: string
  limit: string
  page: string
  dataList: ApplictionInfo[]
}
