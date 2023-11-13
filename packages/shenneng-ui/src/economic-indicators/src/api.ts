import { EdomsRequestFunc } from '@edoms/utils';

import {
  Apis,
  FetchCumulativeDataReq,
  FetchCumulativeDataRes,
  FetchCurveDataReq,
  FetchCurveDataRes,
  FetchEnvMonitoringReq,
  FetchEnvMonitoringRes,
  FetchExecuteApiReq,
  FetchHistoryDataReq,
  FetchHistoryDataRes,
  FetchRealDataReq,
  FetchRealDataRes,
  FetchTceStatisticsDataReq,
  FetchTceStatisticsDataRes,
} from './type';

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
  fetchCumulativeData: async (data: FetchCumulativeDataReq): Promise<FetchCumulativeDataRes> => {
    if (!request) {
      return [];
    }
    try {
      const { result } = await request<FetchCumulativeDataReq, FetchCumulativeDataRes>({
        url: '/OperationalMonitorCommon/cumulativeData',
        method: 'POST',
        data,
      });
      return result;
    } catch (error) {
      return [];
    }
  },
  fetchRealData: async (data: FetchRealDataReq): Promise<FetchRealDataRes> => {
    if (!request) {
      return [];
    }
    try {
      const { result } = await request<FetchRealDataReq, FetchRealDataRes>({
        url: '/OperationalMonitorCommon/realData',
        method: 'POST',
        data,
      });
      return result;
    } catch (error) {
      return [];
    }
  },
  fetchCurveData: async (data: FetchCurveDataReq): Promise<FetchCurveDataRes> => {
    if (!request) {
      return [];
    }
    try {
      const { result } = await request<FetchCurveDataReq, FetchCurveDataRes>({
        url: '/OperationalMonitorCommon/curveData',
        method: 'POST',
        data,
      });
      return result;
    } catch (error) {
      return [];
    }
  },
  fetchTceStatisticsData: async (data: FetchTceStatisticsDataReq): Promise<FetchTceStatisticsDataRes> => {
    if (!request) {
      return [];
    }
    try {
      const { result } = await request<FetchTceStatisticsDataReq, FetchTceStatisticsDataRes>({
        url: '/componentSevice/electric/queryTCEStatisticsData',
        method: 'POST',
        data,
      });
      return result;
    } catch (error) {
      return [];
    }
  },
  fetchExecuteApi: async (data: FetchExecuteApiReq): Promise<FetchTceStatisticsDataRes> => {
    if (!request) {
      return [];
    }
    try {
      const { result } = await request<FetchExecuteApiReq, FetchTceStatisticsDataRes>({
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
