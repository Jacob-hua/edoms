import { request } from '@/util/request';

import { AppForm, ApplicationInfo, CreateAppRes, ListApplicationsReq, ListApplicationsRes } from './type';
import { DeleteApplicationReq } from './type';
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

export const updateApplication = async (data: AppForm) => {
  await request<AppForm, void>({
    url: '/application/update',
    method: 'PUT',
    data,
  });
};
export const getAppInfo = async (data: { applicationId: string }): Promise<ApplicationInfo> => {
  try {
    const { result } = await request<{ applicationId: string }, ApplicationInfo>({
      url: 'application/applicationInfo',
      method: 'GET',
      data,
    });
    return result;
  } catch (error) {
    return {
      applicationId: '',
      createBy: '',
      createTime: '',
      description: '',
      name: '',
      serviceAddress: '',
      tenantId: '',
      thumbnailId: '',
    };
  }
};
export const deleteApplication = async (data: DeleteApplicationReq) => {
  await request<DeleteApplicationReq, string>({
    url: '/application/delete',
    method: 'DELETE',
    data,
  });
};
