import { request } from '@/util/request';

import { FileUploadRes } from './type';

export const fileUpload = async (data: FormData): Promise<FileUploadRes> => {
  try {
    const { result } = await request<FormData, FileUploadRes>({
      url: '/file/upload',
      method: 'POST',
      data,
    });
    return result;
  } catch (error) {
    return {
      contentId: null,
    };
  }
};
