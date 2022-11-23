import { RequestFunc } from '@edoms/core';

import { FetchEnvMonitoringReq, FetchEnvMonitoringRes } from './type';

export default (request: RequestFunc) => ({
  fetchIndicatorData: async (data: FetchEnvMonitoringReq): Promise<FetchEnvMonitoringRes> => {
    try {
      const { result } = await request<FetchEnvMonitoringReq, FetchEnvMonitoringRes>({
        url: '/operation-monitor/environmental-monitor/actual-time',
        method: 'POST',
        data,
      });
      return result;
    } catch (error) {
      return [];
    }
  },
});
