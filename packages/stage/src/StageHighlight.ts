import { EventBus } from '@edoms/utils';
import Moveable from 'moveable';
import { HIGHLIGHT_EL_ID_PREFIX } from './const';
import StageCore from './StageCore';
import TargetCalibrate from './TargetCalibrate';
import type { StageHighlightConfig } from './types';

export default class StageHighlight extends EventBus {
  public core: StageCore;
  public container: HTMLElement;
  public target?: HTMLElement;
  public moveable?: Moveable;
  public calibrationTarget: TargetCalibrate;

  constructor(config: StageHighlightConfig) {
    super();

    this.core = config.core;
    this.container = config.container;
    this.calibrationTarget = new TargetCalibrate({
      parent: this.core.mask.content,
      mask: this.core.mask,
      dr: this.core.dr,
      core: this.core,
    });
  }

  /**
   * 高亮鼠标悬停的组件
   * @param el 选中组件的Dom节点元素
   */
  public highlight(el: HTMLElement): void {
    if (!el || el === this.target) return;
    this.target = el;
    this.moveable?.destroy();

    this.moveable = new Moveable(this.container, {
      target: this.calibrationTarget.update(el, HIGHLIGHT_EL_ID_PREFIX),
      origin: false,
      rootContainer: this.core.container,
      zoom: 1,
    });
  }

  /**
   * 清空高亮
   */
  public clearHighlight(): void {
    if (!this.moveable) return;
    this.target = undefined;
    this.moveable.target = null;
    this.moveable.updateTarget();
  }

  /**
   * 销毁实例
   */
  public destroy(): void {
    this.moveable?.destroy();
    this.calibrationTarget.destroy();
  }
}
