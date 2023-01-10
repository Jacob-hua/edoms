import { request } from '@/util/request';

import { DownloadFileReq, UploadConfirmReq, UploadConfirmRes, UploadFileReq, UploadFileRes } from './type';

export * from './type';

export default {
  uploadFile: async (data: UploadFileReq): Promise<UploadFileRes> => {
    const formData = Object.entries(data).reduce((formData, item) => {
      formData.set(item[0], item[1]);
      return formData;
    }, new FormData());

    const { result } = await request<FormData, UploadFileRes>({
      url: '/file/upload',
      method: 'POST',
      data: formData,
    });
    return result;
  },
  uploadConfirm: async (data: UploadConfirmReq): Promise<UploadConfirmRes> => {
    const { result } = await request<UploadConfirmReq, UploadConfirmRes>({
      url: '/file/upload-confirm',
      method: 'POST',
      data,
    });
    return result;
  },
  downloadFile: async (data: DownloadFileReq): Promise<any> => {
    return await request<DownloadFileReq, any>({
      url: '/file/download',
      method: 'POST',
      data,
      responseType: 'blob',
    });
  },
};
