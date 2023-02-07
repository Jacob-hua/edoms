import { EdomsRequestFunc } from '@edoms/utils';

import { Apis, GetWeatherRes } from './type';

export default (request?: EdomsRequestFunc): Apis => ({
  getWeather: async (): Promise<GetWeatherRes> => {
    if (!request) {
      return {
        time: '-',
        condition: '-',
        temp: '-',
        windLevel: '-',
      };
    }
    try {
      const { result } = await request<void, GetWeatherRes>({
        url: '/operation-monitor/weather',
        method: 'GET',
      });
      return result;
    } catch (error) {
      return {
        time: '-',
        condition: '-',
        temp: '-',
        windLevel: '-',
      };
    }
  },
});
