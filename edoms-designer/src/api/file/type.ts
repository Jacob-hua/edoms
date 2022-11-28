export interface UploadFileReq {
  /** 文件 */
  file: File | Blob;
  /** 文件类型 */
  fileType: string;
  /** 文件名称 */
  fileName: string;
}

export interface UploadFileRes {
  /** 文件Id */
  contentId: string;
}

export interface DownloadFileReq {
  /** 文件Id **/
  contentId: string;
}
