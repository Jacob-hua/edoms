import { EdomsRequestFunc } from '@edoms/utils';

import { Apis, FetchParameterReq, FetchParameterRes } from './type';

export default (request?: EdomsRequestFunc): Apis => ({
  fetchParameterData: async (data: FetchParameterReq): Promise<FetchParameterRes> => {
    if (!request) {
      return [];
    }
    try {
      const { result } = await request<FetchParameterReq, FetchParameterRes>({
        url: '/operation-monitor/system-operating-parameters',
        method: 'POST',
        data,
      });
      return result;
    } catch (error) {
      return [];
    }
  },
});
