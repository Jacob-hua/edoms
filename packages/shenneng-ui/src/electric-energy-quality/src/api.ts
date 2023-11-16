import { EdomsRequestFunc } from '@edoms/utils';

import {
  Apis,
  FetchEfficiencyReq,
  FetchEfficiencyRes,
  FetchExecuteApiReq,
  FetchFactorDataReq,
  FetchHistoryDataReq,
  FetchHistoryDataRes,
  FetchVoltagAnallysisRes,
} from './type';

export default (request?: EdomsRequestFunc): Apis => ({
  fetchRunningData: async (): Promise<any> => {
    if (!request) return [];
    try {
      const result = await request<any, any>({
        url: '/OperationalMonitorSystem/thirdApiList',
        method: 'GET',
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
  fetchFactorLoad: async (data: FetchFactorDataReq): Promise<[]> => {
    if (!request) {
      return [];
    }
    try {
      const { result } = await request<FetchFactorDataReq, []>({
        url: '/OperationalMonitorCommon/executeApi',
        method: 'POST',
        data,
      });
      return result;
    } catch (error) {
      return [];
    }
  },
  fetchFactorDay: async (data: FetchFactorDataReq): Promise<[]> => {
    if (!request) {
      return [];
    }
    try {
      const { result } = await request<FetchFactorDataReq, []>({
        url: '/OperationalMonitorCommon/executeApi',
        method: 'POST',
        data,
      });
      return result;
    } catch (error) {
      return [];
    }
  },
  fetchFactorWeek: async (data: FetchFactorDataReq): Promise<[]> => {
    if (!request) {
      return [];
    }
    try {
      const { result } = await request<FetchFactorDataReq, []>({
        url: '/OperationalMonitorCommon/executeApi',
        method: 'POST',
        data,
      });
      return result;
    } catch (error) {
      return [];
    }
  },
  fetchStData: async (data: any): Promise<any> => {
    if (!request) {
      return [];
    }
    try {
      const { result } = await request<any, any>({
        url: '/OperationalMonitorCommon/executeApi',
        method: 'POST',
        data,
      });
      return result;
    } catch (error) {
      return [];
    }
  },
});
