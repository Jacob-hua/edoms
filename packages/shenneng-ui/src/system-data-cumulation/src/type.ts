import { MComponent } from '@edoms/schema';

export interface QueryItem {
  [key: string]: any;
}

export interface queryConfigs extends MComponent {
  warningList: QueryItem[];
}
