export interface EdStyle {
  width?: string
  height?: string
  [key: string]: any
}

export enum EdActionPropType {
  CONTEXT = 'context',
  CONST = 'const',
  ACTION = 'action',
}

export interface EdActionProp {
  argument: string
  type: EdActionPropType
  source: string
}

export interface EdAction {
  name: string
  target: string
  effect: string
  props?: EdActionProp[]
}

export interface EdRequest {
  url: string
}

export interface EdComponent {
  id: string
  type: string | 'container' | 'page' | 'app'
  name?: string
  disabled?: boolean
  style?: EdStyle
  actions?: EdAction[]
  [key: string]: any
}

export interface EdContainer extends EdComponent {
  type: 'container' | string
  children: (EdComponent | EdContainer)[]
}

export interface EdPage extends EdContainer {
  type: 'page'
}

export interface EdApplication extends EdComponent {
  type: 'app'
  pages: EdPage[]
}

export type EdMeta = EdComponent | EdContainer | EdPage | EdApplication

export interface EdInstance {
  effects: {
    [key: string]: Function
  }
  [key: string]: any
}

export enum EdDataType {
  CONTEXT = 'context',
  CONST = 'const',
  API = 'api',
}

export interface EdDataValue {
  target: string
  sourcePath: string
}

export interface EdData<T> {
  type: EdDataType
  value: T | EdDataValue
}

export type Text = string | EdData<string>

export interface EdText extends EdComponent {
  text?: Text
  disabledText?: Text
}

export interface EdButton extends EdComponent {
  text?: Text
  disabledText?: Text
}
