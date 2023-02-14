import { EdomsRequestFunc } from '@edoms/utils';

import { Apis, FetchEfficiencyReq, FetchEfficiencyRes } from './type';

export default (request?: EdomsRequestFunc): Apis => ({
  fetchEfficiencyData: async (data: FetchEfficiencyReq): Promise<FetchEfficiencyRes> => {
    if (!request) {
      return [];
    }
    try {
      const { result } = await request<FetchEfficiencyReq, FetchEfficiencyRes>({
        url: '/operation-monitor/machine-efficiency',
        method: 'POST',
        data,
      });
      return result;
    } catch (error) {
      return [];
    }
  },
});
