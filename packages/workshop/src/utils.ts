import { dom } from '@edoms/utils'

export const createMaskContent = (): HTMLDivElement => {
  return dom.createDiv({
    className: 'edoms-editor-mask',
    cssText: 'position: absolute; top: 0; left: 0; transform: translate3d(0, 0, 0);',
  })
}

export const createWrapper = (): HTMLDivElement => {
  return dom.createDiv({
    className: 'edoms-editor-mask-wrapper',
    cssText: 'position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; z-index: 99999',
  })
}
