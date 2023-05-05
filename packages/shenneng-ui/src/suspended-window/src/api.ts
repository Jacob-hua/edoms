/*
 * @Description:
 * @Author: lihao
 * @Date: 2023-05-04 10:11:38
 * @LastEditors: lihao
 * @LastEditTime: 2023-05-04 10:45:05
 */
import { EdomsRequestFunc } from '@edoms/utils';

import { Apis, FetchEnvMonitoringReq, FetchEnvMonitoringRes, FetchHistoryDataReq, FetchHistoryDataRes } from './type';

export default (request?: EdomsRequestFunc): Apis => ({
  fetchIndicatorData: async (data: FetchEnvMonitoringReq): Promise<FetchEnvMonitoringRes> => {
    if (!request) {
      return [];
    }
    try {
      const { result } = await request<FetchEnvMonitoringReq, FetchEnvMonitoringRes>({
        url: '/operation-monitor/environmental-monitoring',
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
        url: '/operation-monitor/history-data',
        method: 'POST',
        data,
      });
      return result;
    } catch (error) {
      return [];
    }
  },
});
