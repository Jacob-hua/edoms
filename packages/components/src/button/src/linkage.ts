import { LinkageDefine } from '@/type'

export enum ActionEnum {
  CLICK = 'edom-button:click',
}

export enum ResponseEnum {
  DISABLED = 'disabled',
  ENABLED = 'enabled',
}

const linkage: LinkageDefine = {
  actions: [
    {
      label: '点击',
      value: ActionEnum.CLICK,
    },
  ],
  effects: [
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

export default linkage
