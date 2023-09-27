import { MComponent } from '@edoms/schema';

export interface AnaItem {
  eqName: string;
  unitName: string;
}

export interface AnaItemConfigs extends MComponent {
  warningList: AnaItem[];
}

export interface Apis {
  fetchRunningData: (data: any) => Promise<any>;
  fetchTableDataList: (data: any) => Promise<any>;
}
