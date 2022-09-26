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

export interface Parameter {
  name: string
  label: string
}

export interface ActionProps {
  label: string
  value: string
  returns?: Parameter[]
}

export interface EffectProps {
  label: string
  value: string
  arguments?: Parameter[]
}

export interface LinkageDefine {
  actionProps: ActionProps[]
  effectProps: EffectProps[]
}

export interface Context {
  application: Record<string | number | symbol, any>
  page: Record<string | number | symbol, any>
  component: Record<string | number | symbol, any>
}

export interface EdInstance {
  effects: Record<string, Function>
  config?: {
    linkageDefine: LinkageDefine
    context: Context
  }
}
