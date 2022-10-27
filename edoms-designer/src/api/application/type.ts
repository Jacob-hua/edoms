export interface ApplicationInfo {
  applicationId: string;
  name: string;
  createBy: string;
  description: string;
  serviceAddress: string;
  createTime: string;
  thumbnailId: string;
  tenantId: string;
  [key: string]: any;
}

export interface ListApplicationsReq {
  page: number;
  limit: number;
}

export interface ListApplicationsRes {
  count: string;
  limit: string;
  page: string;
  dataList: ApplicationInfo[];
}

export interface AppForm {
  applicationId?: string;
  name: string;
  description: string;
  thumbnailId?: string | null;
  serviceAddress?: string | null;
}

export interface CreateAppRes {
  applicationId: number | null;
}

export interface FileUploadRes {
  contentId: string | null;
}
