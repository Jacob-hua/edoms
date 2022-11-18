import { UploadRawFile } from 'element-plus';

export interface UploadFileRes {
  contentId: string | null;
}

export interface UploadFileReq {
  file: UploadRawFile;
  fileType: string;
  fileName: string;
}
