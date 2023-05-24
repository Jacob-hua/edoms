export enum NodeType {
  CONTAINER = 'container',
  PAGE = 'page',
  ROOT = 'app',
}

export type Id = string | number;

export const enum ValueSpace {
  COMPONENT = 'component',
  PAGE = 'page',
  APP = 'app',
  CONST = 'const',
  EXPRESSION = 'expression',
  EVENT = 'event',
  TEMPLATE = 'template',
}

export interface MappingStruct {
  target: string;
  ignore?: boolean;
  source?: string;
  sourceSpace: ValueSpace;
  const?: string;
  defaultValue?: string;
  expression?: string;
  template?: string;
}

export type EventArgs = Record<string | number | symbol, any>;

export type MethodProps = EventArgs;

export const enum EventAction {
  COMPONENT_LINKAGE = 'component_linkage',
  ROUTE_SETTING = 'route_setting',
}

export interface EventItemConfig {
  /** 事件名称 */
  name: string;
  /** 事件动作 */
  action: EventAction;
  /** 目标页面ID */
  page?: Id;
  /** 联动组件ID */
  to?: Id;
  /** 触发事件后执行被选中组件的方法 */
  method?: string;
  mappings?: MappingStruct[];
}

export const enum StoreType {
  APP = 'app',
  PAGE = 'page',
  COMPONENT = 'component',
}

export const enum StoreValueType {
  CONST = 'const',
  EXPRESSION = 'expression',
  VARIABLE = 'variable',
}

export interface StoreItemConfig {
  variable: string;
  type: StoreType;
  valueType: StoreValueType;
  value: string;
}

export interface MComponent {
  /** 组件ID，默认为${type}_${number}}形式, 如：page_123 */
  id: Id;
  /** 组件类型 */
  type?: string;
  /** 组件显示名称 */
  name?: string;
  /** 组件根Dom上的class */
  className?: string;
  /* 关联事件集合 */
  events?: EventItemConfig[];
  /** 值存储集合 */
  stores?: StoreItemConfig[];
  /** 组件根Dom的style */
  style?: {
    [key: string]: any;
  };
  [key: string]: any;
}

export interface MContainer extends MComponent {
  /** 容器类型，默认为'container' */
  type?: NodeType.CONTAINER | string;
  /** 容器子元素 */
  items: (MComponent | MContainer)[];
}

export interface MPage extends MContainer {
  /** 页面类型 */
  type: NodeType.PAGE;
}

export interface MApp extends MComponent {
  /** App页面类型，app作为整个结构的根节点；有且只有一个 */
  type: NodeType.ROOT;
  /** */
  items: MPage[];
  index?: Id;
  tenantId?: string;
  referenceResource?: {
    [key: Id]: string;
  };
}

export interface PastePosition {
  left?: number;
  top?: number;
}

export type MNode = MComponent | MContainer | MPage | MApp;

export interface Callback {
  (...args: any[]): any;
  __depends__?: string[];
}

export interface MNodeInstance {
  methods?: Record<string, Callback>;
  $el?: HTMLElement;
}
