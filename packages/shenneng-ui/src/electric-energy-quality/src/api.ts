import { EdomsRequestFunc } from '@edoms/utils';

import {
  Apis,
  FetchEfficiencyReq,
  FetchEfficiencyRes,
  FetchExecuteApiReq,
  FetchHistoryDataReq,
  FetchHistoryDataRes,
  FetchVoltagAnallysisRes,
} from './type';

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
  fetchExecuteApi: async (data: FetchExecuteApiReq): Promise<FetchVoltagAnallysisRes> => {
    if (!request) {
      return {
        histogram: { seriesData: [], xaxisData: [] },
        underVoltage: [],
        overVoltage: [],
        voltageFluctuation: [],
      };
    }
    try {
      const { result } = await request<FetchExecuteApiReq, FetchVoltagAnallysisRes>({
        url: '/OperationalMonitorCommon/executeApi',
        method: 'POST',
        data,
      });
      return result;
    } catch (error) {
      return {
        histogram: { seriesData: [], xaxisData: [] },
        underVoltage: [],
        overVoltage: [],
        voltageFluctuation: [],
      };
    }
  },
});
