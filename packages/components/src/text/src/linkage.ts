import { LinkageDefine } from '@/type'

export enum ActionEnum {}

export enum ResponseEnum {
  DISABLED = 'disatbled',
  ENABLED = 'enabled',
  TEST = 'test',
}

const linkage: LinkageDefine = {
  actions: [],
  effects: [
    {
      label: '禁用',
      value: ResponseEnum.DISABLED,
    },
    {
      label: '启用',
      value: ResponseEnum.ENABLED,
    },
    {
      label: '测试',
      value: ResponseEnum.TEST,
      props: ['data'],
    },
  ],
}

export default linkage
