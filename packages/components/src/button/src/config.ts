import { LinkageDefine } from '@edoms/meta-model'

export enum ActionEnum {
  CLICK = 'edoms:action:click',
}

export enum EffectEnum {
  DISABLED = 'disabled',
  ENABLED = 'enabled',
}

export const linkageDefine: LinkageDefine = {
  actionProps: [
    {
      label: '点击',
      value: ActionEnum.CLICK,
    },
  ],
  effectProps: [
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
