import { EdomsRequestFunc } from '@edoms/utils';

import { Apis, FetchEfficiencyReq, FetchEfficiencyRes, FetchHistoryDataReq, FetchHistoryDataRes } from './type';

export default (request?: EdomsRequestFunc): Apis => ({
  fetchHistoryData: async (data: FetchHistoryDataReq): Promise<FetchHistoryDataRes> => {
    if (!request) {
      return [];
    }
    try {
      const { result } = await request<FetchHistoryDataReq, FetchHistoryDataRes>({
        url: '/operation-monitor/history-data',
        method: 'POST',
        data,
      });
      return result;
    } catch (error) {
      return [];
    }
  },
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
