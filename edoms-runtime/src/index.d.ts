import type { MApp } from '@tmagic/schema';

declare global {
  interface Window {
    magicDSL: MApp[];
    magicPresetComponents: any;
    magicPresetConfigs: any;
    magicPresetValues: any;
    magicPresetEvents: any;
  }
}
