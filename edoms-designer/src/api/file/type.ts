import { UploadRawFile } from 'element-plus';

export interface FileUploadRes {
  contentId: string | null;
}

export interface FileUploadData {
  file: UploadRawFile;
  fileType: string;
  fileName: string;
}
