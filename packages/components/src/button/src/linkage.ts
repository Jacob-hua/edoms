import { LinkageDefine } from '@/type'

export enum ActionEnum {
  CLICK = 'edom-button:click',
}

export enum ResponseEnum {
  DISABLED = 'disabled',
  ENABLED = 'enabled',
}

export const linkage: LinkageDefine = {
  actions: [
    {
      label: '点击',
      value: ActionEnum.CLICK,
    },
  ],
  responses: [
    {
      label: '禁用',
      value: ResponseEnum.DISABLED,
    },
    {
      label: '启用',
      value: ResponseEnum.ENABLED,
    },
  ],
}

console.log(linkage)
