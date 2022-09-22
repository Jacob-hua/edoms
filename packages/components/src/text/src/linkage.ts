import { LinkageDefine } from '@/type'

export enum ActionEnum {}

export enum EffectEnum {
  DISABLED = 'disatbled',
  ENABLED = 'enabled',
  TEST = 'test',
}

const linkage: LinkageDefine = {
  actions: [],
  effects: [
    {
      label: '禁用',
      value: EffectEnum.DISABLED,
    },
    {
      label: '启用',
      value: EffectEnum.ENABLED,
    },
    {
      label: '测试',
      value: EffectEnum.TEST,
      props: ['data'],
    },
  ],
}

export default linkage
