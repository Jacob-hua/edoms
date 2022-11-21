export interface UploadFileRes {
  /** 文件标识ID */
  contentId: string | null;
}

export interface UploadFileReq {
  /** 文件 */
  file: File;
  /** 文件类型 */
  fileType: string;
  /** 文件名称 */
  fileName: string;
}

export interface DownloadFileReq {
  /** 文件Id **/
  contentId: string;
  /** 是否是预览 **/
  isPreview: boolean;
}
