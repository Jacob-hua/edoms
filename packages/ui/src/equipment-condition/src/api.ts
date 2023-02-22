import { EdomsRequestFunc } from '@edoms/utils';

import { Apis, FetchHistoryDataReq, FetchHistoryDataRes, FetchRealTimeDataReq, FetchRealTimeDataRes } from './type';

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
  fetchRealTimeData: async (data: FetchRealTimeDataReq): Promise<FetchRealTimeDataRes> => {
    if (!request) {
      return [];
    }
    try {
      const { result } = await request<FetchRealTimeDataReq, FetchRealTimeDataRes>({
        url: '/operation-monitor/real-time-data',
        method: 'POST',
        data,
      });
      return result;
    } catch (error) {
      return [];
    }
  },
});
