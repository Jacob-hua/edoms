import { MComponent } from '@edoms/schema';

export interface MLightItem {
  color: string;
  maxValue: number;
  minValue: number;
  text: string;
}

export interface MMulticolorSingleLight extends MComponent {
  initValue: number;
  lights: MLightItem[];
}

export interface LightItem extends MLightItem {
  style?: string;
}
