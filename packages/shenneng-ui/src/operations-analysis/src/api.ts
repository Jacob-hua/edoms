/*
 * @Description:
 * @Author: lihao
 * @Date: 2023-04-27 11:42:51
 * @LastEditors: lihao
 * @LastEditTime: 2023-04-27 13:32:49
 */
import { EdomsRequestFunc } from '@edoms/utils';

import { Apis, FetcheneryConsumptionRes, FetchExecuteApiReq } from './type';

export default (request?: EdomsRequestFunc): Apis => ({
  fetchExecuteApi: async (data: FetchExecuteApiReq): Promise<FetcheneryConsumptionRes> => {
    if (!request) {
      return [];
    }
    try {
      const { result } = await request<FetchExecuteApiReq, FetcheneryConsumptionRes>({
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
