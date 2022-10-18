import { ContentType, RequestMethod } from '@edoms/utils';
import { EdActionPropType, EdContextScope } from './enum';

export type EdComponentType = string | 'container' | 'page' | 'app';

export type EdId = string;

export interface EdStyle {
  position?: string;
  left?: number;
  top?: number;
  right?: number;
  bottom?: number;
  width?: number;
  height?: number;
  background?: string;
  backgroundImage?: string;
  backgroundColor?: string;
  backgroundRepeat?: string;
  backgroundSize?: string;
  color?: string;
  fontSize?: number;
  fontWeight?: number;
  borderColor?: string;
  borderStyle?: string;
  borderTopStyle?: string;
  borderRightStyle?: string;
  borderBottomStyle?: string;
  borderLeftStyle?: string;
  borderWidth?: number;
  borderTopWidth?: number;
  borderRightWidth?: number;
  borderBottomWidth?: number;
  borderLeftWidth?: number;
  borderTopLeftRadius?: number;
  borderTopRightRadius?: number;
  borderBottomRightRadius?: number;
  borderBottomLeftRadius?: number;
  [key: string]: any;
}

export interface EdActionProp {
  argument: string;
  type: EdActionPropType;
  source: string;
}

export interface EdAction {
  name: string;
  target: string;
  effect: string;
  props?: EdActionProp[];
}

export interface EdRequest {
  url: string;
  method: RequestMethod;
  header: {
    [key: string]: any;
    ['Content-Type']: ContentType;
  };
  data: EdActionProp[];
}

export interface EdComponent {
  id: EdId;
  type: EdComponentType;
  name?: string;
  className?: string;
  display?: boolean;
  disabled?: boolean;
  style?: EdStyle;
  actions?: EdAction[];
  [key: string]: any;
}

export interface EdContainer extends EdComponent {
  type: 'container' | string;
  children: (EdComponent | EdContainer)[];
}

export interface EdPage extends EdContainer {
  type: 'page';
  title: string;
}

export interface EdApplication extends EdComponent {
  type: 'app';
  pages: EdPage[];
}

export type EdMeta = EdComponent | EdContainer | EdPage | EdApplication;

export interface Parameter {
  name: string;
  label: string;
}

export interface ActionProps {
  label: string;
  value: string;
  returns?: Parameter[];
}

export interface EffectProps {
  label: string;
  value: string;
  arguments?: Parameter[];
}

export interface LinkageDefine {
  actionProps: ActionProps[];
  effectProps: EffectProps[];
}

export type Context = {
  [key in EdContextScope]: Record<string | number | symbol, any>;
};

export interface EdInstance {
  effects: Record<string, Function>;
  config: {
    linkageDefine: LinkageDefine;
    context: Context;
  };
}
