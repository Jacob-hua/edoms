export interface ActionOption {
  label: string
  value: string
}

export interface ResponseOption {
  label: string
  value: string
}

export interface LinkageDefine {
  actions: ActionOption[]
  responses: ResponseOption[]
}
