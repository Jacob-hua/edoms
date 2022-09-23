import { LinkageDefine } from '@/type'

export enum ActionEnum {}

export enum EffectEnum {
  DISABLED = 'disatbled',
  ENABLED = 'enabled',
  UPDATE_TEXT = 'updateText',
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
      label: '更新文本',
      value: EffectEnum.UPDATE_TEXT,
      props: ['text', 'disabledText'],
    },
  ],
}

export default linkage
