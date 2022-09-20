export interface ActionOption {
  label: string
  value: string
  returns?: string[]
}

export interface EffectOption {
  label: string
  value: string
  props?: string[]
}

export interface LinkageDefine {
  actions: ActionOption[]
  effects: EffectOption[]
}
