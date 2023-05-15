import { MComponent } from '@edoms/schema';

export type ClassName = 'red' | 'orange' | 'blue';

export interface MWarningRunningList extends MComponent {
  speed: number;
  isScroll: boolean;
  intervalDelay: number;
  instance: string[];
  timeSpan: number;
  isVirtual: string;
}

export interface InitAlarmReq {
  sysInsCode: string;
  timeSpan: number;
  isVirtual: string;
}
export interface InitAlarmRes {
  commonAlarm: AlarmList;
  seriousAlarm: AlarmList;
  importantAlarm: AlarmList;
}
export interface AlarmList {
  confirmed: boolean;
  list: Alarm[];
}

export interface Alarm {
  id: number;
  date: string;
  type: string;
  title: string;
  content: string;
  status: 'confirmed' | 'unconfirm';
}

export interface Apis {
  fetchInitAlarmList: (data: InitAlarmReq) => Promise<InitAlarmRes>;
  fetchNewAlarmList: (data: Pick<InitAlarmReq, 'sysInsCode' | 'isVirtual'>) => Promise<InitAlarmRes>;
  confirmedAlarmList: () => Promise<string>;
}
