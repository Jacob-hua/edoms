import { request } from '@/util/request';

import {
  AppForm,
  ApplicationInfo,
  CreateAppRes,
  FileUploadRes,
  ListApplicationsReq,
  ListApplicationsRes,
} from './type';
export const listApplications = async (data: ListApplicationsReq): Promise<ListApplicationsRes> => {
  try {
    const { result } = await request<ListApplicationsReq, ListApplicationsRes>({
      url: '/application/page',
      method: 'POST',
      data,
    });
    return result;
  } catch (error) {
    return {
      count: '0',
      limit: '0',
      page: '0',
      dataList: [],
    };
  }
};

export const createApplication = async (data: AppForm): Promise<CreateAppRes> => {
  try {
    const { result } = await request<AppForm, CreateAppRes>({
      url: '/application/create',
      method: 'POST',
      data,
    });
    return result;
  } catch (error) {
    return {
      applicationId: null,
    };
  }
};

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
export const updateApplication = async (data: AppForm): Promise<any> => {
  try {
    return await request<AppForm, string>({
      url: '/application/update',
      method: 'PUT',
      data,
    });
  } catch (error) {
    return {
      errorInfo: {
        errorCode: '',
        errorMsg: '',
      },
      result: '',
    };
  }
};
export const getAppInfo = async (data: { applicationId: string }): Promise<any> => {
  try {
    return await request<{ applicationId: string }, ApplicationInfo>({
      url: 'application/applicationInfo',
      method: 'GET',
      data,
    });
  } catch (error) {
    return {
      errorInfo: {
        errorCode: '',
        errorMsg: '',
      },
      result: {
        applicationId: '',
        createBy: '',
        createTime: '',
        description: '',
        name: '',
        serviceAddress: '',
        tenantId: '',
        thumbnailId: '',
      },
    };
  }
};
