import { EdomsRequestFunc } from '@edoms/utils';

import { FetchParameterReq, FetchParameterRes } from './type';

export * from './type';

export default (request?: EdomsRequestFunc) => ({
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
