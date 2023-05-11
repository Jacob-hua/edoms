import { EdomsRequestFunc } from '@edoms/utils';

import { Apis, FetchCumulativeDataReq, FetchCumulativeDataRes, FetchHistoryDataReq, FetchHistoryDataRes } from './type';

export default (request?: EdomsRequestFunc): Apis => ({
  fetchCumulativeData: async (data: FetchCumulativeDataReq): Promise<FetchCumulativeDataRes> => {
    if (!request) {
      return [];
    }
    try {
      const { result } = await request<FetchCumulativeDataReq, FetchCumulativeDataRes>({
        url: '/OperationalMonitorCommon/system-grand-total',
        method: 'POST',
        data,
      });
      return result;
    } catch (error) {
      return [];
    }
  },
  fetchHistoryData: async (data: FetchHistoryDataReq): Promise<FetchHistoryDataRes> => {
    if (!request) {
      return [];
    }
    try {
      const { result } = await request<FetchHistoryDataReq, FetchHistoryDataRes>({
        url: '/operation-monitor/system-grand-chart-data',
        method: 'POST',
        data,
      });
      return result;
    } catch (error) {
      return [];
    }
  },
});
