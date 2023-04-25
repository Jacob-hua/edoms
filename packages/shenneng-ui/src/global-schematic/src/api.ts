import { EdomsRequestFunc } from '@edoms/utils';

import { Apis, FetchGlobSchematicReq, FetchGlobSchematicRes } from './type';

export default (request?: EdomsRequestFunc): Apis => ({
  fetchIndicatorData: async (data: FetchGlobSchematicReq): Promise<FetchGlobSchematicRes> => {
    if (!request) {
      return [];
    }
    try {
      const { result } = await request<FetchGlobSchematicReq, FetchGlobSchematicRes>({
        url: '/operation-monitor/home-chart-data',
        method: 'POST',
        data,
      });
      return result;
    } catch (error) {
      return [];
    }
  },
});
