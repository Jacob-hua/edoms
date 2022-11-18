export interface ApplicationInfo {
  applicationId: string;
  name: string;
  thumbnailId: string;
  description: string;
  serviceAddress: string;
  tenantId: string;
  createBy: string;
  createTime: string;
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

export interface CreateApplicationReq {
  name: string;
  description: string;
  thumbnailId?: string | null;
}

export interface CreateApplicationRes {
  applicationId: number | null;
}

export interface UpdateApplicationReq {
  applicationId: string;
  name: string;
  description: string;
  thumbnailId?: string | null;
  serviceAddress?: string | null;
}

export interface GetApplicationInfoReq {
  applicationId: string;
}

export interface GetApplicationInfoRes extends ApplicationInfo {
  [key: string]: any;
}

export interface DeleteApplicationReq {
  applicationId: string;
  secret: string;
}
