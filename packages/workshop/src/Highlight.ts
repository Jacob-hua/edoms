import { EventBus } from '@edoms/utils';
import Moveable from 'moveable';
import TargetCalibrate from './TargetCalibrate';
import Workshop from './WorkShop';
import { HighlightProps } from './type';

class Highlight extends EventBus {
  public workshop: Workshop;
  public container: HTMLElement;
  public target?: HTMLElement;
  public moveable?: Moveable;
  public calibrateTarget: TargetCalibrate;

  constructor(props: HighlightProps) {
    super();

    this.workshop = props.workshop;
    this.container = props.container;
    this.calibrateTarget = new TargetCalibrate({
      parentElement: this.workshop.mask.content,
      mask: this.workshop.mask,
      dragBox: this.workshop.dragBox,
      workshop: this.workshop,
    });
  }

  public active(element: HTMLElement): void {
    if (!element || element === this.target) {
      return;
    }
    this.target = element;
    this.moveable?.destroy();

    this.moveable = new Moveable(this.container, {
      target: this.calibrateTarget.update(element, 'highlight_el_'),
      origin: false,
      rootContainer: this.workshop.container,
      zoom: 1,
    });
  }

  public slake(): void {
    if (!this.moveable) {
      return;
    }
    this.target = undefined;
    this.moveable.target = null;
    this.moveable.updateTarget();
  }

  public destroy(): void {
    this.moveable?.destroy();
    this.calibrateTarget.destroy();
  }
}

export default Highlight;
