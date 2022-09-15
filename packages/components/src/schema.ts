export interface EdComponent {
  id?: string
  type: string | 'container' | 'page' | 'app'
  name?: string
  disabled?: boolean
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

export type EdNode = EdComponent | EdContainer | EdPage | EdApplication

export interface EdFunction<T> {
  (context: any, data: object): T
}

export type Text = string | EdFunction<string>

export enum EdParameterType {
  CONST = 'const',
  COMPONENT = 'component',
}

export interface EdParameter {
  type: EdParameterType
  source: string
  variable: string
}

export interface EdEvent {
  name: string
  target: string
  method: string
  parameter?: EdParameter[]
}

export interface EdText extends EdComponent {
  text?: Text
  disabledText?: Text
}

export interface EdButton extends EdComponent {
  text?: Text
  disabledText?: Text
  events?: EdEvent[]
}
