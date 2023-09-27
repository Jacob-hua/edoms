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

export type FetchRealDataRes = RealData[];

export type FetchCumulativeDataRes = CumulativeData[];

export interface Apis {
  fetchRealData: (data: FetchRealDataReq) => Promise<FetchRealDataRes>;
}
