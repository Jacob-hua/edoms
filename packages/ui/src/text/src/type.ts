import { MComponent } from '@edoms/schema';

export interface MText extends MComponent {
  text?: string;
  disabledText?: string;
  multiple?: boolean;
}
