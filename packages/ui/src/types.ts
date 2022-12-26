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
/* tabs */
export type MTabs = MContainer;
export interface MTabsProps {
  config: MTabs;
  model: Object;
}
export type ArrayOneOrMore = { 0: string } & string[];

import { BarSeriesOption, LineSeriesOption } from 'echarts/charts';
import {
  DatasetComponentOption,
  GridComponentOption,
  TitleComponentOption,
  TooltipComponentOption,
} from 'echarts/components';
import * as echarts from 'echarts/core';

export type ECOption = echarts.ComposeOption<
  | BarSeriesOption
  | LineSeriesOption
  | TitleComponentOption
  | TooltipComponentOption
  | GridComponentOption
  | DatasetComponentOption
>;
