import { request } from '@/util/request';

import {
  CreatePageReq,
  CreatePageRes,
  DeletePageReq,
  GetPageReq,
  GetPageRes,
  ListPageInfosReq,
  ListPageInfosRes,
  UpdatePageReq,
} from './type';

export * from './type';

export const getPage = async (data: GetPageReq): Promise<GetPageRes> => {
  const { result } = await request<GetPageReq, GetPageRes>({
    url: '/page',
    method: 'GET',
    data,
  });
  return result;
};

export const listPages = async (data: ListPageInfosReq): Promise<ListPageInfosRes> => {
  try {
    const { result } = await request<ListPageInfosReq, ListPageInfosRes>({
      url: '/page/list',
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
};

export const createPage = async (data: CreatePageReq): Promise<CreatePageRes> => {
  const { result } = await request<CreatePageReq, CreatePageRes>({
    url: '/page/create',
    method: 'POST',
    data,
  });
  return result;
};

export const updatePage = async (data: UpdatePageReq): Promise<void> => {
  await request<UpdatePageReq, void>({
    url: '/page/update',
    method: 'PUT',
    data,
  });
};

export const deletePage = async (data: DeletePageReq): Promise<void> => {
  await request<DeletePageReq, void>({
    url: '/page/delete',
    method: 'DELETE',
    data,
  });
};
