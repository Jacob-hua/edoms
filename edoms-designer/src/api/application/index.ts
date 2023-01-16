import { request } from '@/util/request';

import {
  CreateApplicationReq,
  CreateApplicationRes,
  ExportApplicationReq,
  GetApplicationReq,
  GetApplicationRes,
  ListApplicationsReq,
  ListApplicationsRes,
  PreviewApplicationReq,
  UpdateApplicationReq,
  UpdateDefaultVersionReq,
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
    const { result } = await request<CreateApplicationReq, CreateApplicationRes>({
      url: '/application/create',
      method: 'POST',
      data,
    });
    return result;
  },
  updateApplication: async (data: UpdateApplicationReq): Promise<void> => {
    await request<CreateApplicationReq, void>({
      url: '/application/update',
      method: 'PUT',
      data,
    });
  },
  getApplication: async (data: GetApplicationReq): Promise<GetApplicationRes> => {
    const { result } = await request<GetApplicationReq, GetApplicationRes>({
      url: '/application',
      method: 'GET',
      data,
    });
    return result;
  },
  deleteApplication: async (data: DeleteApplicationReq): Promise<void> => {
    await request<DeleteApplicationReq, void>({
      url: '/application/delete',
      method: 'DELETE',
      data,
    });
  },
  previewApplication: async (data: PreviewApplicationReq): Promise<string> => {
    const { result } = await request<PreviewApplicationReq, string>({
      url: '/application/preview',
      method: 'GET',
      data,
    });
    return result;
  },
  exportApplication: async (data: ExportApplicationReq): Promise<any> => {
    return await request<ExportApplicationReq, any>({
      url: '/application/export',
      method: 'GET',
      data,
      responseType: 'blob',
    });
  },
  countApplication: async (): Promise<number> => {
    const { result } = await request<void, number>({
      url: '/application/application-count',
      method: 'GET',
    });
    return result;
  },
  updateDefaultVersion: async (data: UpdateDefaultVersionReq): Promise<void> => {
    await request<UpdateDefaultVersionReq, void>({
      url: '/application/update-defaultVersion',
      method: 'PUT',
      data,
    });
  },
};
