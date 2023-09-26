import { EdomsRequestFunc } from '@edoms/utils';

import { Apis } from './type';

export default (request?: EdomsRequestFunc): Apis => ({
  fetchRunningData: async (): Promise<any> => {
    if (!request) return [];
    try {
      const { result } = await request<any, any>({
        url: '/OperationalMonitorSystem/thirdApiList',
        method: 'GET',
      });
      return result;
    } catch (error) {
      return [];
    }
  },
  fetchTableDataList: async (): Promise<any> => {
    if (!request) return { nextList: [], newList: [] };
    try {
      const { result } = await request<any, any>({
        url: '/OperationalMonitorSystem/thirdApiList',
        method: 'GET',
      });
      return result;
    } catch (error) {
      return {
        nextList: [],
        newList: [],
      };
    }
  },
});
