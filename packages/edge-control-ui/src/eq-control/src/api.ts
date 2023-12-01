import { EdomsRequestFunc } from '@edoms/utils';

import { Apis, FetchExecuteApiReq, FetchExecuteApiRes } from './type';

export default (request?: EdomsRequestFunc): Apis => ({
  fetchRunningData: async (): Promise<any> => {
    if (!request) return [];
    try {
      const result = await request<any, any>({
        url: '/OperationalMonitorSystem/thirdApiList',
        method: 'GET',
      });
      return result;
    } catch (error) {
      return [];
    }
  },
  fetchTableDataList: async (data: any): Promise<any> => {
    if (!request) return { nextList: [], newList: [] };
    try {
      const result = await request<any, any>({
        url: '/OperationalMonitorCommon/executeApi',
        method: 'POST',
        data,
      });
      return result;
    } catch (error) {
      return {
        nextList: [],
        newList: [],
      };
    }
  },
  fetchExecuteApi: async (data: FetchExecuteApiReq): Promise<FetchExecuteApiRes> => {
    if (!request) {
      return [];
    }
    try {
      const { result } = await request<FetchExecuteApiReq, FetchExecuteApiRes>({
        url: '/OperationalMonitorCommon/executeApi',
        method: 'POST',
        data,
      });
      return result;
    } catch (error) {
      return [];
    }
  },
});
