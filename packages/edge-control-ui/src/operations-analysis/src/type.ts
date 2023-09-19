import { MComponent } from '@edoms/schema';

export interface AnaItem {
  eqName: string;
  unitName: string;
}

export interface AnaItemConfigs extends MComponent {
  title: string;
  warningList: AnaItem[];
}
