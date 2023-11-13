import { MComponent } from '@edoms/schema';

export interface AnaItem {
  eqName: string;
  unitName: string;
}

export interface AnaItemConfigs extends MComponent {
  title: string;
  warningList: AnaItem[];
}

export interface FetchExecuteApiReq {
  apiCode: string;
  requestParam: any;
}
export interface IelectricAnalysis {
  [key: string]: number;
}

export interface Iload {
  lightLoadNum: number;
  heavyLoad: number;
  overloadNum: number;
  heavyLoadNum: number;
  lightLoad: number;
  overload: number;
}

export interface IeneryConsumption<T, U> {
  totalValue: string;
  deviceInsName: string;
  load: T;
  peakValleyRatio: number;
  deviceInsCode: string;
  electricAnalysis: U;
  maxLoadRate: number;
  minLoadRate: number;
}

export type IeneryConsumptionSum = IeneryConsumption<Iload, IelectricAnalysis>;
export type FetcheneryConsumptionRes = IeneryConsumptionSum[];
export interface Apis {
  fetchExecuteApi: (data: FetchExecuteApiReq) => Promise<FetcheneryConsumptionRes>;
}
