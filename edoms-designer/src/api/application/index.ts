import { request } from '@/util/request';

import {
  CreateApplicationReq,
  CreateApplicationRes,
  GetApplicationReq,
  GetApplicationRes,
  ListApplicationsReq,
  ListApplicationsRes,
  ReleaseApplicationReq,
  UpdateApplicationReq,
} from './type';
import { DeleteApplicationReq } from './type';

export * from './type';

export default {
  listApplications: async (data: ListApplicationsReq): Promise<ListApplicationsRes> => {
    try {
      const { result } = await request<ListApplicationsReq, ListApplicationsRes>({
        url: '/application/list',
        method: 'POST',
        data,
      });
      return result;
    } catch (error) {
      return {
        count: 0,
        limit: 0,
        page: 0,
        dataList: [],
      };
    }
  },
  createApplication: async (data: CreateApplicationReq): Promise<CreateApplicationRes> => {
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
  },
  updateApplication: async (data: UpdateApplicationReq): Promise<void> => {
    await request<CreateApplicationReq, void>({
      url: '/application/update',
      method: 'PUT',
      data,
    });
  },
  getApplication: async (data: GetApplicationReq): Promise<GetApplicationRes> => {
    try {
      const { result } = await request<GetApplicationReq, GetApplicationRes>({
        url: '/application',
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
        secret: '',
        export: false,
      };
    }
  },
  deleteApplication: async (data: DeleteApplicationReq): Promise<void> => {
    await request<DeleteApplicationReq, void>({
      url: '/application/delete',
      method: 'DELETE',
      data,
    });
  },
  releaseApplication: async (data: ReleaseApplicationReq): Promise<void> => {
    await request<ReleaseApplicationReq, void>({
      url: '/application/release',
      method: 'GET',
      data,
    });
  },
};
