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

export const addClassName = (element: Element, doc: Document, className: string): void => {
  const oldElement = doc.querySelector(`.${className}`)
  if (oldElement && oldElement !== element) {
    removeClassName(oldElement, className)
  }
  if (!element.classList.contains(className)) {
    element.classList.add(className)
  }
}

export const removeClassName = (element: Element, className: string): void => {
  element.classList.remove(className)
}

export const removeClassNameByClassName = (doc: Document, className: string): HTMLElement | null => {
  const element: HTMLElement | null = doc.querySelector(`.${className}`)
  element?.classList.remove(className)
  return element
}

export const injectStyle = (doc: Document, style: string): HTMLElement => {
  const styleElement = document.createElement('style')
  styleElement.innerHTML = style
  doc.head.appendChild(styleElement)
  return styleElement
}

export const getParents = (element: Element, relative: Element): Element[] => {
  let current: Element | null = element.parentElement
  const parents: Element[] = []
  while (current && current !== relative) {
    parents.push(current)
    current = current.parentElement
  }
  return parents
}
