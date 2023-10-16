import { MComponent } from '@edoms/schema';

export interface warningItem {
  warningName: string;
  warningCode: string;
}

export interface MWarningConfigs extends MComponent {
  title: string;
  subTitle: string;
  speed: number;
  isScroll: boolean;
  intervalDelay: number;
  isVirtual: string;
  instance: string[];
  timeSpan: number;
}

export type ClassName = 'red' | 'orange' | 'green';

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
  fetchCurrentAlarm: () => Promise<InitAlarmRes>;
  confirmedAlarmList: () => Promise<string>;
}
