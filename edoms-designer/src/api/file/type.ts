export interface UploadFileReq {
  /** 文件 */
  file: File | Blob;
  /** 文件类型 */
  fileType: string;
  /** 文件名称 */
  fileName: string;
  /** 依赖资源 */
  referenceIds?: string;
}

export interface UploadFileRes {
  /** 文件Id */
  contentId: string;
}

export interface DownloadFileReq {
  /** 文件Id **/
  contentId: string;
}
