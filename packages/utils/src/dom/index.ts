import { typeOf } from '../object'
import { DivProperty, ElementOffset } from './type'

export const createDiv = ({ className, cssText }: DivProperty): HTMLDivElement => {
  const element = globalThis.document.createElement('div')
  element.className = className
  element.style.cssText = cssText
  return element
}

export const getElementOffset = (element: HTMLElement): ElementOffset => {
  const left = element.offsetLeft
  const top = element.offsetTop

  if (element.offsetParent && typeOf(element.offsetParent, HTMLElement)) {
    const parentOffset = getElementOffset(element.offsetParent as HTMLElement)
    return {
      left: left + parentOffset.left,
      top: top + parentOffset.top,
    }
  }

  return {
    left,
    top,
  }
}

export const getElementParents = (element: Element, relative: Element): Element[] => {
  let current = element.parentElement
  const parents: Element[] = []
  while (current && current !== relative) {
    parents.push(current)
    current = current.parentElement
  }
  return parents
}

export const getAbsolutePosition = (element: HTMLElement, offset: ElementOffset): ElementOffset => {
  if (element.offsetParent) {
    const parentOffset = getElementOffset(element.offsetParent as HTMLElement)
    return {
      left: offset.left - parentOffset.left,
      top: offset.top - parentOffset.top,
    }
  }
  return offset
}

export const isFixedParent = (element: HTMLElement): boolean => {
  let isFixed = false
  let dom = element
  while (dom) {
    isFixed = globalThis.getComputedStyle(dom).position === 'fixed'
    if (isFixed) {
      break
    }
    if (!dom.parentElement || dom.parentElement.tagName === 'BODY') {
      break
    }
    dom = dom.parentElement
  }
  return isFixed
}

export const getScrollParent = (element: HTMLElement, includeHidden = false): HTMLElement | null => {
  let style = globalThis.getComputedStyle(element)
  const overflowRegex = includeHidden ? /(auto|scroll|hidden)/ : /(auto|scroll)/
  if (style.position === 'fixed') {
    return null
  }
  let parent: HTMLElement | null = element
  while (parent && parent.parentElement) {
    parent = element.parentElement
    if (!parent) {
      continue
    }
    style = globalThis.getComputedStyle(parent)
    if (['absolute', 'static'].includes(style.position)) {
      continue
    }
    if (overflowRegex.test(style.overflow + style.overflowY + style.overflowX)) {
      return parent
    }
  }
  return null
}
