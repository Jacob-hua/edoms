import { request } from '@/util/request';

import { DownloadFileReq, UploadFileReq, UploadFileRes } from './type';

export * from './type';

export const uploadFile = async (data: UploadFileReq): Promise<UploadFileRes> => {
  try {
    const formData = new FormData();
    formData.set('file', data.file!);
    formData.set('fileType', data.fileType);
    formData.set('fileName', data.fileName);

    const { result } = await request<FormData, UploadFileRes>({
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
export const downloadFile = async (data: DownloadFileReq): Promise<any> => {
  return await request<DownloadFileReq, any>({
    url: '/file/download',
    method: 'POST',
    data,
    responseType: 'blob',
  });
};
