import { dom } from '@edoms/utils'
import { Mode, ZIndex } from './enum'

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

export const getMode = (element: HTMLElement): Mode => {
  if (dom.isFixedParent(element)) {
    return Mode.FIXED
  }
  const style = globalThis.getComputedStyle(element)
  if (['static', 'relative'].includes(style.position)) {
    return Mode.SORTABLE
  }
  return Mode.ABSOLUTE
}

export const getTargetElStyle = (el: HTMLElement) => {
  const offset = dom.getElementOffset(el)
  const { transform } = getComputedStyle(el)
  return `
    position: absolute;
    transform: ${transform};
    left: ${offset.left}px;
    top: ${offset.top}px;
    width: ${el.clientWidth}px;
    height: ${el.clientHeight}px;
    z-index: ${ZIndex.DRAG_EL};
  `
}
