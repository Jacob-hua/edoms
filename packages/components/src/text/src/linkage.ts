import { LinkageDefine } from '@/type'

export enum ActionEnum {}

export enum ResponseEnum {
  DISABLED = 'disatbled',
  ENABLED = 'enabled',
}

const linkage: LinkageDefine = {
  actions: [],
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

export default linkage
