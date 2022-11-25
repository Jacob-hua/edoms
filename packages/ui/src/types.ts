/* style */
export type PartCSSStyle = {
  [key in keyof CSSStyleDeclaration]?: string | number;
};
export type CSSStyleKey = keyof CSSStyleDeclaration;
export type CanModifyCSSStyleKey = Exclude<CSSStyleKey, 'length' | 'parentRule'>;
export type StyleCfg = ((p1: any, p2: any) => PartCSSStyle) | PartCSSStyle;

/* event */
export interface MEvent {
  name: string;
  to: number | string;
  method: string;
}
export interface MEventInMap {
  from: number | string;
  to: number | string;
  method: string;
}
export type MEventMapType = Record<string, MEventInMap[]>;
export type MEventQueueMapType = Record<string | number, MEventInMap[]>;
export interface MEventBus {
  $on: (...args: any) => void;
  $off: (...args: any) => void;
  $once: (...args: any) => void;
  $emit: (...args: any) => void;
}

/* component */
export interface MComponent {
  type: string;
  id?: number | string;
  name?: string;
  style?: StyleCfg;
  disabledStyle?: StyleCfg;
  className?: string | ((p1: any, p2: any) => string);
  display?: boolean | ((p1: any, p2: any) => boolean);
  html?: string;
  created?: (p1: any, p2: any) => Promise<any>;
  mounted?: (p1: any, p2: any) => Promise<any>;
  renderType?: number;
  events?: MEvent[];
}
export interface MComponentProps {
  config: MComponent;
  model: Object;
}

/* container */
export interface MContainer extends MComponent {
  items?: MComponent[] | MContainer[];
}
export interface MContainerProps {
  config: MContainer;
  model: Object;
}

/* page */
export interface MPage extends MContainer {
  title?: string;
  cssFile?: string;
}
export interface MPageProps {
  config: MPage;
}

/* pop */
export interface MPop extends MContainer {
  activate: () => void;
  maskClose: boolean;
}
export interface MPopProps {
  config: MPop;
  model: Object;
  fillWithSlot: boolean;
}
export interface MPopObj {
  name: string;
  options: object;
}

/* app */
export interface MApp extends MComponent {
  items: MPage[];
}
export interface MAppProps {
  config: [MApp];
  pageConfig: MPage;
}
export enum MAppElementType {
  pages = 'pages',
  containers = 'containers',
  components = 'components',
  pops = 'pops',
}

/* tabs */
export type MTabs = MContainer;
export interface MTabsProps {
  config: MTabs;
  model: Object;
}

/* text */
export interface MText extends MComponent {
  text?: string;
  disabledText?: string;
  multiple?: boolean;
}
export interface MTextProps {
  config: MText;
  model: Object;
  vars: Object;
}

/* button */
export interface MButton extends MComponent {
  preAction?: (p1: any, p2: any) => string;
  postAction?: (p1: any, p2: any) => string;
  text?: string;
  disabledText?: string;
}
export interface MButtonProps {
  config: MButton;
  model: Object;
}

export type ArrayOneOrMore = { 0: string } & string[];

export interface MImg {
  src: string;
  url: string;
}

export interface MQrcode {
  url: string;
}

// export interface MPop extends MComponent {
//   items?: MComponent[] | MContainer[];
//   closeButtonStyle?: any;
//   closeButton?: boolean;
// }

export enum MEnvironmentIndicator {
  /** 温度 */
  TEMPERATURE = 'temperature',
  /** 湿度 */
  MOISTURE = 'moisture',
  /** 液体深度 */
  LIQUID_DEPTH = 'liquidDepth',
  /** 气体 */
  GAS = 'gas',
}

export interface MIndicatorItemConfig {
  /** 监测指标 */
  type: MEnvironmentIndicator;
  /** 标签 */
  label: string;
  /** 实例类型 */
  instanceType: string;
  /** 实例 */
  instance: string;
  /** 属性类型 */
  propertyType: string;
  /** 属性 */
  property: string;
  /** 预期最大阈值 */
  expectedMax: number;
  /** 预期最小阈值 */
  expectedMin: number;
  /** 目标最大阈值 */
  targetMax: number;
  /** 目标最小阈值 */
  targetMin: number;
  /** 精度 */
  precision: string;
}

export interface MDynamicMonitoring extends MComponent {
  visibleNumber: number;
  intervalDelay: number;
  indicators: MIndicatorItemConfig[];
}
