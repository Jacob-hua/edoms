import { EdomsRequestFunc } from '@edoms/utils';

import { InitAlarmReq, InitAlarmRes } from './type';

export * from './type';

export default (request?: EdomsRequestFunc) => ({
  fetchInitAlarmList: async (data: InitAlarmReq): Promise<InitAlarmRes> => {
    if (!request) {
      return {
        commonAlarm: { confirmed: '', list: [] },
        seriousAlarm: { confirmed: '', list: [] },
        importantAlarm: { confirmed: '', list: [] },
      };
    }
    try {
      const { result } = await request<InitAlarmReq, InitAlarmRes>({
        url: '/operation-monitor/init-alarm-list',
        method: 'GET',
        data,
      });
      return result;
    } catch (error) {
      return {
        commonAlarm: { confirmed: '', list: [] },
        seriousAlarm: { confirmed: '', list: [] },
        importantAlarm: { confirmed: '', list: [] },
      };
    }
  },
});
