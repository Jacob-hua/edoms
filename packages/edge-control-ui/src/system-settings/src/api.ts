import { EdomsRequestFunc } from '@edoms/utils';

import { Apis, FetchExecuteApiReq, FetchExecuteApiRes, FetchRealDataReq, FetchRealDataRes } from './type';

export default (request?: EdomsRequestFunc): Apis => ({
  fetchRealData: async (data: FetchRealDataReq): Promise<FetchRealDataRes> => {
    if (!request) {
      return [];
    }
    try {
      const { result } = await request<FetchRealDataReq, FetchRealDataRes>({
        url: '/OperationalMonitorCommon/realData',
        method: 'POST',
        data,
      });
      return result;
    } catch (error) {
      return [];
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
