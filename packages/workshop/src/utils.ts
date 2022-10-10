import { dom } from '@edoms/utils'
import { removeClassName } from '@edoms/utils/src/dom'
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

export const calculateValueByFontsize = (doc: Document, value: number): number => {
  const { fontSize } = doc.documentElement.style

  if (fontSize) {
    const times = globalThis.parseFloat(fontSize) / 100
    return Number((value / times).toFixed(2))
  }
  return value
}

const SELECTED_CLASS = `.edoms-stage-selected-area`
export const removeSelectedClassName = (doc: Document): void => {
  const oldElement = doc.querySelector(SELECTED_CLASS)
  if (oldElement) {
    removeClassName(oldElement, SELECTED_CLASS)
    if (oldElement.parentNode) {
      removeClassName(oldElement.parentNode as Element, `${SELECTED_CLASS}-parent`)
    }
    doc.querySelectorAll(`.${SELECTED_CLASS}-parent`).forEach((element) => {
      removeClassName(element, `${SELECTED_CLASS}-parent`)
    })
  }
}

export const addSelectedClassName = (element: Element, doc: Document): void => {
  element.classList.add(SELECTED_CLASS)
  ;(element.parentNode as Element)?.classList.add(`${SELECTED_CLASS}-parent`)
  dom.getParents(element, doc.body).forEach((item) => {
    item.classList.add(`${SELECTED_CLASS}-parents`)
  })
}
