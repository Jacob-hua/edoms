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
      value: 'edom-button:click',
    },
  ],
  effects: [
    {
      label: '禁用',
      value: 'disabled',
    },
    {
      label: '启用',
      value: 'enabled',
    },
  ],
}

export default linkage
