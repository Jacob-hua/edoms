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
