import { MComponent } from '@edoms/schema';

export interface MCheckboxOption {
  label: string;
  value: string;
  disabled: boolean;
  selected: boolean;
}

export interface MCheckbox extends MComponent {
  fill: string;
  options: MCheckboxOption[];
}
