import { MComponent } from '@edoms/schema';

export interface warningItem {
  warningName: string;
  warningCode: string;
}

export interface warningConfigs extends MComponent {
  warningList: warningItem[];
}
