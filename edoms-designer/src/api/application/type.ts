export interface ApplicationInfo {
  applicationId: string
  name: string
  createBy: string
  createTime: string
  thumbnailId: string
}

export interface ListApplicationsReq {
  page: number
  limit: number
}

export interface ListApplicationsRes {
  count: string
  limit: string
  page: string
  dataList: ApplicationInfo[]
}
