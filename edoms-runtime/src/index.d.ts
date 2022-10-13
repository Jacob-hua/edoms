import { EdApplication } from '@edoms/meta-model';
import { Edoms } from '@edoms/workshop';

declare global {
  interface Window {
    edomsMeta: EdApplication[];
    edomsPresetValues: any;
    edoms: Edoms;
  }
}
