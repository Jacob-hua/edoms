import { EdApplication } from '@edoms/meta-model';

declare global {
  interface Window {
    edomsMeta: EdApplication[];
    edomsPresetValues: any;
  }
}
