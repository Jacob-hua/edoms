import { EdomsRequestFunc } from '@edoms/utils';

import { Apis, FetchCurveDataReq, FetchCurveDataRes, FetchRealDataReq, FetchRealDataRes } from './type';

export default (request?: EdomsRequestFunc): Apis => ({
  // 查询累计数据（曲线）
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
  // 查询实时数据
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
});
