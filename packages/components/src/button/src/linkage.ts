import { LinkageDefine } from '@/type'

export enum ActionEnum {
  CLICK = 'edoms:action:click',
}

export enum EffectEnum {
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
      value: EffectEnum.DISABLED,
    },
    {
      label: '启用',
      value: EffectEnum.ENABLED,
    },
  ],
}

export default linkage
