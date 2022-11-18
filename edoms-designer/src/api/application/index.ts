import { request } from '@/util/request';

import {
  CreateApplicationReq,
  CreateApplicationRes,
  GetApplicationInfoReq,
  GetApplicationInfoRes,
  ListApplicationsReq,
  ListApplicationsRes,
  UpdateApplicationReq,
} from './type';
import { DeleteApplicationReq } from './type';

export * from './type';

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

export const createApplication = async (data: CreateApplicationReq): Promise<CreateApplicationRes> => {
  try {
    const { result } = await request<CreateApplicationReq, CreateApplicationRes>({
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

export const updateApplication = async (data: UpdateApplicationReq) => {
  await request<CreateApplicationReq, void>({
    url: '/application/update',
    method: 'PUT',
    data,
  });
};

export const getApplicationInfo = async (data: GetApplicationInfoReq): Promise<GetApplicationInfoRes> => {
  try {
    const { result } = await request<GetApplicationInfoReq, GetApplicationInfoRes>({
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
  await request<DeleteApplicationReq, void>({
    url: '/application/delete',
    method: 'DELETE',
    data,
  });
};
