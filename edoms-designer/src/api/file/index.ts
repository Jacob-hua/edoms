import { request } from '@/util/request';

import { FileUploadData, FileUploadRes } from './type';

export const fileUpload = async (data: FileUploadData): Promise<FileUploadRes> => {
  try {
    const formData = new FormData();
    formData.set('file', data.file!);
    formData.set('fileType', data.fileType);
    formData.set('fileName', data.fileName);
    const { result } = await request<FormData, FileUploadRes>({
      url: '/file/upload',
      method: 'POST',
      data: formData,
    });
    return result;
  } catch (error) {
    return {
      contentId: null,
    };
  }
};
