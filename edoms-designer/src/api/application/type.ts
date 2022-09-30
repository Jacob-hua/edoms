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

export interface AppForm {
  name: string
  description: string
  thumbnailId?: string | null
}

export interface createAppRes {
  applicationId: number | null
}

export interface FileUploadRes {
  contentId: string | null
}
