export interface Argument {
  name: string
  label: string
}

export interface ActionOption {
  label: string
  value: string
  returns?: Argument[]
}

export interface EffectOption {
  label: string
  value: string
  props?: Argument[]
}

export interface LinkageDefine {
  actions: ActionOption[]
  effects: EffectOption[]
}
