import { EdomsRequestFunc } from '@edoms/utils';

import { Apis, InitAlarmReq, InitAlarmRes } from './type';

export default (request?: EdomsRequestFunc): Apis => ({
  fetchInitAlarmList: async (data: InitAlarmReq): Promise<InitAlarmRes> => {
    if (!request) {
      return {
        commonAlarm: { confirmed: false, list: [] },
        seriousAlarm: { confirmed: false, list: [] },
        importantAlarm: { confirmed: false, list: [] },
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
        commonAlarm: { confirmed: false, list: [] },
        seriousAlarm: { confirmed: false, list: [] },
        importantAlarm: { confirmed: false, list: [] },
      };
    }
  },
  fetchNewAlarmList: async (data: Pick<InitAlarmReq, 'sysInsCode' | 'isVirtual'>): Promise<InitAlarmRes> => {
    if (!request) {
      return {
        commonAlarm: { confirmed: false, list: [] },
        seriousAlarm: { confirmed: false, list: [] },
        importantAlarm: { confirmed: false, list: [] },
      };
    }
    try {
      const { result } = await request<Pick<InitAlarmReq, 'sysInsCode'>, InitAlarmRes>({
        url: '/operation-monitor/new-alarm-list',
        method: 'GET',
        data,
      });
      return result;
    } catch (error) {
      return {
        commonAlarm: { confirmed: false, list: [] },
        seriousAlarm: { confirmed: false, list: [] },
        importantAlarm: { confirmed: false, list: [] },
      };
    }
  },
  confirmedAlarmList: async (): Promise<string> => {
    if (!request) {
      return '';
    }
    try {
      const { result } = await request<void, string>({
        url: '/operation-monitor/alarm-confirm',
        method: 'put',
      });
      return result;
    } catch (error) {
      return '';
    }
  },
});
