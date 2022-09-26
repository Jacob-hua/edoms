import { ContentType, RequestMethod } from '@edoms/utils'
import { EdActionPropType } from './enum'

export type EdComponentType = string | 'container' | 'page' | 'app'

export type EdId = string

export interface EdStyle {
  width?: string
  height?: string
  [key: string]: any
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
  method: RequestMethod
  heade: {
    [key: string]: any
    ['Content-Type']: ContentType
  }
  data: EdActionProp[]
}

export interface EdComponent {
  id: EdId
  type: EdComponentType
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
  config?: {
    effectOptions: any[]
    actionOptions: any[]
    context: any[]
    globalContext: any[]
    expose: any[]
  }
}
