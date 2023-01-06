export interface UploadFileReq {
  /** 文件 */
  file: File | Blob;
  /** 文件类型 */
  fileType: string;
  /** 文件名称 */
  fileName: string;
  /** 分片序号 */
  chunkIndex: number;
  /** 分片总数 */
  chunkSize: number;
  /** uid */
  uid: string;
}

export interface UploadFileRes {
  /** 上传进度 */
  progress: number;
}

export interface UploadConfirmReq {
  /** uid */
  uid: string;
  /** 是否完成 */
  finished: boolean;
  /** 文件类型 */
  fileType: string;
  /** 文件名称 */
  fileName: string;
  /** 文件摘要 */
  md5: string;
  /** 依赖资源ID */
  referenceIds?: string;
}

export interface UploadConfirmRes {
  /** 文件资源ID */
  contentId: string;
}

export interface DownloadFileReq {
  /** 文件Id **/
  contentId: string;
}
