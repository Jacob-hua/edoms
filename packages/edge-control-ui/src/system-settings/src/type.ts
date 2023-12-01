import { MComponent } from '@edoms/schema';

export interface AnaItem {
  eqName: string;
  unitName: string;
}

export interface AnaItemConfigs extends MComponent {
  warningList: AnaItem[];
}

export interface FetchRealDataReq {
  dataCodes: string[];
}

export interface CumulativeData {
  propCode: string;
  propValue: string;
}

export interface RealData {
  propCode: string;
  propVal: string;
}

interface ExecuteComparsionApiParams {
  codes: string;
  names: string;
}

export interface ExecuteComparsionData {
  unit: string;
  code: string;
  name: string;
  value: number;
}
export interface FetchExecuteApiReq {
  apiCode: string;
  requestParam: ExecuteComparsionApiParams;
}

export type FetchExecuteApiRes = ExecuteComparsionData[];

export type FetchRealDataRes = RealData[];

export type FetchCumulativeDataRes = CumulativeData[];

export interface Apis {
  fetchRealData: (data: FetchRealDataReq) => Promise<FetchRealDataRes>;
  fetchExecuteApi: (data: FetchExecuteApiReq) => Promise<FetchExecuteApiRes>;
}
