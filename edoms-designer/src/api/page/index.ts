import { request } from '@/util/request';

import {
  CreatePageReq,
  CreatePageRes,
  DeletePageReq,
  GetPageReq,
  GetPageRes,
  ListPageReq,
  ListPageRes,
  SavePageReq,
  UpdatePageReq,
} from './type';

export * from './type';

export default {
  getPage: async (data: GetPageReq): Promise<GetPageRes> => {
    const { result } = await request<GetPageReq, GetPageRes>({
      url: '/page',
      method: 'GET',
      data,
    });
    return result;
  },
  listPages: async (data: ListPageReq): Promise<ListPageRes> => {
    try {
      const { result } = await request<ListPageReq, ListPageRes>({
        url: '/page/list',
        method: 'POST',
        data,
      });
      return result;
    } catch (error) {
      return {
        applicationId: '',
        applicationName: '',
        count: 0,
        limit: 0,
        page: 0,
        dataList: [],
      };
    }
  },
  createPage: async (data: CreatePageReq): Promise<CreatePageRes> => {
    const { result } = await request<CreatePageReq, CreatePageRes>({
      url: '/page/create',
      method: 'POST',
      data,
    });
    return result;
  },
  updatePage: async (data: UpdatePageReq): Promise<void> => {
    await request<UpdatePageReq, void>({
      url: '/page/update',
      method: 'PUT',
      data,
    });
  },
  deletePage: async (data: DeletePageReq): Promise<void> => {
    await request<DeletePageReq, void>({
      url: '/page/delete',
      method: 'DELETE',
      data,
    });
  },
  savePage: async (data: SavePageReq): Promise<void> => {
    await request<SavePageReq, void>({
      url: '/page/save',
      method: 'POST',
      data,
    });
  },
};
