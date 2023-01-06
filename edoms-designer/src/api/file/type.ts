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
  /** 文件摘要 */
  fileAbstract: string;
  /** uid */
  uid: string;
}

export interface UploadFileRes {
  /** 上传进度 */
  progress: number;
}

export interface DownloadFileReq {
  /** 文件Id **/
  contentId: string;
}
