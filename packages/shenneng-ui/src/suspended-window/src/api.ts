/*
 * @Description:
 * @Author: lihao
 * @Date: 2023-05-04 10:11:38
 * @LastEditors: lihao
 * @LastEditTime: 2023-05-16 08:49:04
 */
import { EdomsRequestFunc } from '@edoms/utils';

import {
  Apis,
  FetchCumulativeDataReq,
  FetchCumulativeDataRes,
  FetchCurveDataReq,
  FetchCurveDataRes,
  FetchEnvMonitoringReq,
  FetchEnvMonitoringRes,
  FetchHistoryDataReq,
  FetchHistoryDataRes,
  FetchRealDataReq,
  FetchRealDataRes,
} from './type';
// import { Apis, FetchEnvMonitoringReq, FetchEnvMonitoringRes, FetchHistoryDataReq, FetchHistoryDataRes } from './type';

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
});
