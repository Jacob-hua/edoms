import { EdomsRequestFunc } from '@edoms/utils';

import { Apis, FetchOperationParamReq, FetchOperationParamRes } from './type';

export default (request?: EdomsRequestFunc): Apis => ({
  fetchOperationParameter: async (data: FetchOperationParamReq): Promise<FetchOperationParamRes> => {
    if (!request) {
      return [];
    }
    try {
      const { result } = await request<FetchOperationParamReq, FetchOperationParamRes>({
        url: '/operation-monitor/device-operating-parameters',
        method: 'POST',
        data,
      });
      return result;
    } catch (error) {
      return [];
    }
  },
});
