import { request } from '@/util/request';

import {
  CreatePageReq,
  CreatePageRes,
  DeletePageReq,
  DeletePageRes,
  ListPageInfosReq,
  ListPageInfosRes,
  UpdatePageReq,
  UpdatePageRes,
} from './type';

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
      count: '0',
      limit: '0',
      page: '0',
      dataList: [],
    };
  }
};

export const createPage = async (data: CreatePageReq): Promise<CreatePageRes> => {
  try {
    const { result } = await request<CreatePageReq, CreatePageRes>({
      url: '/page/create',
      method: 'POST',
      data,
    });
    return result;
  } catch (error) {
    return {
      result: {
        pageId: null,
      },
    };
  }
};

export const updatePage = async (data: UpdatePageReq): Promise<UpdatePageRes> => {
  try {
    const { result } = await request<UpdatePageReq, UpdatePageRes>({
      url: '/page/update',
      method: 'PUT',
      data,
    });
    return result;
  } catch (e) {
    return {
      result: '',
    };
  }
};

export const deletePage = async (data: DeletePageReq): Promise<DeletePageRes> => {
  try {
    const { result } = await request<DeletePageReq, DeletePageRes>({
      url: '/page/delete',
      method: 'DELETE',
      data,
    });
    return result;
  } catch (e) {
    return {
      result: '',
    };
  }
};
