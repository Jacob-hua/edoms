import { EdomsRequestFunc } from '@edoms/utils';

import { Apis, FetchParametersReq, FetchParametersRes, UpdateParametersReq } from './type';

export default (request?: EdomsRequestFunc): Apis => ({
  fetchParametersData: async (data: FetchParametersReq): Promise<FetchParametersRes> => {
    if (!request) {
      return [];
    }
    try {
      const { result } = await request<FetchParametersReq, FetchParametersRes>({
        url: '/operation-monitor/get-runtime-data',
        method: 'GET',
        data,
      });
      return result;
    } catch (error) {
      return [];
    }
  },
  updateParameterData: async (data: UpdateParametersReq): Promise<void> => {
    if (!request) {
      return;
    }
    await request<UpdateParametersReq, void>({
      url: '/operation-monitor/set-runtime-data',
      method: 'POST',
      data,
    });
  },
});
