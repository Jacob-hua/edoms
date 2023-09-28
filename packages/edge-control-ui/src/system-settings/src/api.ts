import { EdomsRequestFunc } from '@edoms/utils';

import { Apis, FetchRealDataReq, FetchRealDataRes } from './type';

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
});
