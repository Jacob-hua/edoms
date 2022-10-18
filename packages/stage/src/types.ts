import { MoveableOptions } from 'moveable';

import { Engine } from '@edoms/engine';
import type { EdId, EdApplication, EdMeta } from '@edoms/meta-model';

import { GuidesType } from './const';
import StageCore from './StageCore';
import StageDragResize from './StageDragResize';
import StageMask from './StageMask';

export type CanSelect = (el: HTMLElement, event: MouseEvent, stop: () => boolean) => boolean | Promise<boolean>;
export type IsContainer = (el: HTMLElement) => boolean | Promise<boolean>;

export type StageCoreConfig = {
  /** 需要对齐的dom节点的CSS选择器字符串 */
  snapElementQuerySelector?: string;
  /** 放大倍数，默认1倍 */
  zoom?: number;
  canSelect?: CanSelect;
  isContainer: IsContainer;
  containerHighlightClassName: string;
  containerHighlightDuration: number;
  moveableOptions?: ((core?: StageCore) => MoveableOptions) | MoveableOptions;
  /** runtime 的HTML地址，可以是一个HTTP地址，如果和编辑器不同域，需要设置跨域，也可以是一个相对或绝对路径 */
  runtimeUrl?: string;
  render?: (renderer: StageCore) => Promise<HTMLElement> | HTMLElement;
  autoScrollIntoView?: boolean;
  updateDragEl?: (el: HTMLDivElement, target: HTMLElement) => void;
};

export interface StageRenderConfig {
  core: StageCore;
}

export interface StageMaskConfig {
  core: StageCore;
}

export interface StageDragResizeConfig {
  core: StageCore;
  container: HTMLElement;
  mask: StageMask;
}

export type Rect = {
  width: number;
  height: number;
} & Offset;

export interface Offset {
  left: number;
  top: number;
}

export interface GuidesEventData {
  type: GuidesType;
  guides: number[];
}

export interface UpdateEventData {
  el: HTMLElement;
  parentEl: HTMLElement | null;
  ghostEl: HTMLElement;
  style: {
    width?: number;
    height?: number;
    left?: number;
    top?: number;
    transform?: {
      rotate?: string;
      scale?: string;
    };
  };
}

export interface SortEventData {
  src: EdId;
  dist: EdId;
  root?: EdApplication;
}

export interface UpdateData {
  config: EdMeta;
  root: EdApplication;
}

export interface RemoveData {
  id: EdId;
  root: EdApplication;
}

export interface Runtime {
  getApp?: () => Engine;
  beforeSelect?: (el: HTMLElement) => Promise<boolean> | boolean;
  getSnapElements?: (el?: HTMLElement) => HTMLElement[];
  updateRootConfig?: (config: EdApplication) => void;
  updatePageId?: (id: EdId) => void;
  select?: (id: EdId) => Promise<HTMLElement> | HTMLElement;
  add?: (data: UpdateData) => void;
  update?: (data: UpdateData) => void;
  sortNode?: (data: SortEventData) => void;
  remove?: (data: RemoveData) => void;
}

export interface Magic {
  /** 当前页面的根节点变化时调用该方法，编辑器会同步该el和stage的大小，该方法由stage注入到iframe.contentWindow中 */
  onPageElUpdate: (el: HTMLElement) => void;

  onRuntimeReady: (runtime: Runtime) => void;
}

export interface RuntimeWindow extends Window {
  magic: Magic;
}

export interface StageHighlightConfig {
  core: StageCore;
  container: HTMLElement;
}

export interface TargetCalibrateConfig {
  parent: HTMLElement;
  mask: StageMask;
  dr: StageDragResize;
  core: StageCore;
}
