import { MComponent } from '@edoms/schema';

export interface MLightItem {
  color: string;
  maxValue: number;
  minValue: number;
}

export interface MIndicatorLight extends MComponent {
  initValue: number;
  lights: MLightItem[];
}

export interface LightItem extends MLightItem {
  style?: string;
}
