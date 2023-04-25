import { MComponent } from '@edoms/schema';

export interface MButton extends MComponent {
  preAction?: (p1: any, p2: any) => string;
  postAction?: (p1: any, p2: any) => string;
  text?: string;
  disabledText?: string;
}
