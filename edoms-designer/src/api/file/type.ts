import { UploadRawFile } from 'element-plus';

export interface UploadFileRes {
  /** 文件标识ID */
  contentId: string | null;
}

export interface UploadFileReq {
  /** 文件 */
  file: UploadRawFile;
  /** 文件类型 */
  fileType: string;
  /** 文件名称 */
  fileName: string;
}
