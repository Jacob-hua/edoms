import { MComponent } from '@edoms/schema';

export interface AnaItem {
  eqName: string;
  unitName: string;
}

export interface AnaItemConfigs extends MComponent {
  warningList: AnaItem[];
}

export interface FetchExecuteApiReq {
  apiCode: string;
  requestParam: any;
}

export type FetchExecuteApiRes = Record<string, any>;

export interface Apis {
  fetchRunningData: (data: any) => Promise<any>;
  fetchTableDataList: (data: any) => Promise<any>;
  fetchExecuteApi: (data: FetchExecuteApiReq) => Promise<FetchExecuteApiRes>;
}
