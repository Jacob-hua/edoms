import { request } from '@/util/request';

import { ListInstanceReq, ListInstanceRes, ListPointReq, ListPointRes } from './type';

export * from './type';

export default {
  listInstance: async (data: ListInstanceReq): Promise<ListInstanceRes> => {
    try {
      const { result } = await request<ListInstanceReq, ListInstanceRes>({
        url: '/common/sec-energy/system-device-tree',
        method: 'POST',
        data,
      });
      return result;
    } catch (error) {
      return [];
    }
  },
  listPointCode: async (data: ListPointReq): Promise<ListPointRes> => {
    try {
      const { result } = await request<ListPointReq, ListPointRes>({
        url: '/code/point/sec/point-code-list',
        method: 'POST',
        data,
      });
      return result;
    } catch (error) {
      return [];
    }
  },
};
