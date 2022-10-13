import Workshop, { MoveableOptions } from '@edoms/workshop';

export interface WorkshopOptions {
  runtimeUrl: string;
  render: () => HTMLElement;
  moveableOptions: MoveableOptions | ((workshop?: Workshop) => MoveableOptions);
}
