export interface VersionReq {
  page: number;
  limit: number;
  pageId: number;
}

export interface VersionRes {
  page: string;
  limit: string;
  count: 1;
  dataList: Version[];
}

export interface Version {
  versionId: number;
  pageId: number;
  name: string;
  createBy: string;
  createTime: number;
  updateBy: string;
  updateTime: number;
  pushContentId: string;
  editContentId: string;
}

export interface UpdateVersionReq {
  versionId: number;
  name: string;
  pageId: number;
}

export interface SaveVersionReq {
  pageId: number;
  contentId: number;
  name: string;
  description: string;
}

export interface RecoveryReq {
  versionId: number;
}

export interface DeleteVersion {
  versionIds: string[];
}
