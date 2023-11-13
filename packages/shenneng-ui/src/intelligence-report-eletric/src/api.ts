/*
 * @Description:
 * @Author: lihao
 * @Date: 2023-04-27 11:42:51
 * @LastEditors: lihao
 * @LastEditTime: 2023-04-27 13:32:49
 */
import { EdomsRequestFunc } from '@edoms/utils';

import {
  Apis,
  FetchEfficiencyReq,
  FetchEfficiencyRes,
  FetchExecuteApiReq,
  FetchHistoryDataReq,
  FetchHistoryDataRes,
  FetchintelligenceRes,
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
  fetchExecuteApi: async (data: FetchExecuteApiReq): Promise<FetchintelligenceRes> => {
    if (!request) {
      return [];
    }
    try {
      const { result } = await request<FetchExecuteApiReq, FetchintelligenceRes>({
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
