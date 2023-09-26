import { MComponent } from '@edoms/schema';

export enum MEconomicIndicator {
  /** 电费 */
  AIRHEAT = 'eqHeat',
  AIRCONDITIONING = 'aircod',
}

export interface AnaItem {
  eqName: string;
  unitName: string;
}

export interface AnaItemConfigs extends MComponent {
  warningList: AnaItem[];
}
