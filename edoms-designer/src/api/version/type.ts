import { PageStruct } from '@/const/struct';

export interface ListVersionsReq {
  /** 页码 */
  page: number;
  /** 页面大小 */
  limit: number;
  /** 页面ID */
  pageId: string;
}

export interface Version {
  /** 版本ID */
  versionId: string;
  /** 页面ID */
  pageId: string;
  /** 版本名称 */
  name: string;
  /** 发布内容ID */
  pushContentId: string;
  /** 编辑内容ID */
  editContentId: string;
  /** 创建者 */
  createBy: string;
  /** 创建时间 */
  createTime: number;
  /** 更新者 */
  updateBy: string;
  /** 更新时间 */
  updateTime: number;
}

export type ListVersionsRes = PageStruct<Version>;

export interface UpdateVersionReq {
  /** 版本ID */
  versionId: string;
  /** 版本名称 */
  name: string;
  /** 页面ID */
  pageId: number;
}

export interface SaveWithVersionReq {
  /** 页面ID */
  pageId: string;
  /** 内容ID */
  contentId: string;
  /** 版本名称 */
  name: string;
  /** 版本简介 */
  description: string;
}

export interface RecoveryVersionReq {
  /** 版本ID */
  versionId: string;
}

export interface DeleteVersion {
  /** 版本ID集合 */
  versionIds: string[];
}
