import { dom, EventBus } from '@edoms/utils'
import { GuidesType, Mode, ZIndex } from './enum'
import Mask from './Mask'
import Workshop from './WorkShop'
import Moveable, { MoveableOptions } from 'moveable'
import MoveableHelper from 'moveable-helper'
import { getMode, getTargetElStyle, calculateValueByFontsize } from './utils'
import { DragBoxProps } from './type'

enum ActionStatus {
  /** 开始拖动 */
  START = 'start',
  /** 拖动中 */
  ING = 'ing',
  /** 拖动结束 */
  END = 'end',
}

class DragBox extends EventBus {
  public workshop: Workshop
  public mask: Mask
  public container: HTMLElement
  public target?: HTMLElement
  public dragElement?: HTMLDivElement
  public moveable?: Moveable
  public horizontalGuidelines: number[] = []
  public verticalGuidelines: number[] = []
  public elementGuidelines: HTMLElement[] = []
  public mode: Mode = Mode.ABSOLUTE

  private moveableOptions: MoveableOptions = {}
  private ghostElement: HTMLElement | undefined
  private moveableHelper?: MoveableHelper
  private dragStatus: ActionStatus = ActionStatus.END

  constructor(props: DragBoxProps) {
    super()
    this.workshop = props.workshop
    this.container = props.container
    this.mask = props.mask
  }

  public select(element: HTMLElement, event?: MouseEvent): void {
    const oldTarget = this.target
    this.target = element

    // 切换拖拽目标是需要重新创建moveable
    if (!this.moveable || this.target !== oldTarget) {
      this.init(element)
      this.moveableHelper = MoveableHelper.create({
        useBeforeRender: true,
        useRender: false,
        createAuto: true,
      })
      this.initMoveable()
    }

    if (event) {
      this.moveable?.dragStart(event)
    }
  }

  public updateMoveable(element = this.target): void {
    if (!this.moveable) {
      throw new Error('This moveable is not initialization')
    }
    if (!element) {
      throw new Error('No elements selected')
    }

    this.target = element
    this.init(element)
    Object.entries(this.moveableOptions).forEach(([key, value]) => {
      ;(this.moveable as any)[key] = value
    })
    this.moveable.updateTarget()
  }

  public setGuidelines(type: GuidesType, guidelines: number[]): void {
    if (type === GuidesType.HORIZONTAL) {
      this.horizontalGuidelines = guidelines
      this.moveableOptions.horizontalGuidelines = guidelines
    } else if (type === GuidesType.VERTICAL) {
      this.verticalGuidelines = guidelines
      this.moveableOptions.verticalGuidelines = guidelines
    }
    if (this.moveable) {
      this.updateMoveable()
    }
  }

  public clearGuides() {
    this.horizontalGuidelines = []
    this.verticalGuidelines = []
    this.moveableOptions.horizontalGuidelines = []
    this.moveableOptions.verticalGuidelines = []
  }

  public clearSelectStatus() {
    if (!this.moveable) {
      return
    }
    this.destroyDragElement()
    this.moveable.target = null
    this.moveable.destroy()
  }

  public destroy(): void {
    this.moveable?.destroy()
    this.destroyDragElement()
    this.destroyGhostElement()
    this.dragStatus = ActionStatus.END
    this.removeAllListeners()
  }

  private destroyGhostElement(): void {
    this.ghostElement?.remove()
    this.ghostElement = undefined
  }

  private destroyDragElement(): void {
    this.dragElement?.remove()
  }

  private init(element: HTMLElement): void {
    // 如果css滚动条没有隐藏，则隐藏滚动条
    if (/(auto|scroll)/.test(element.style.overflow)) {
      element.style.overflow = 'hidden'
    }
    this.mode = getMode(element)

    this.destroyGhostElement()
    this.destroyDragElement()
    this.dragElement = globalThis.document.createElement('div')
    this.container.append(this.dragElement)
    this.dragElement.style.cssText = getTargetElStyle(element)
    this.dragElement.id = `drag_element_${element.id}`

    if (typeof this.workshop.config.updateDragElement === 'function') {
      this.workshop.config.updateDragElement(this.dragElement, element)
    }

    this.moveableOptions = this.generateOptions({
      target: this.dragElement,
    })
  }

  private generateOptions(options: MoveableOptions = {}): MoveableOptions {
    if (!this.target) {
      return {}
    }

    const isAbsolute = this.mode === Mode.ABSOLUTE
    const isFixed = this.mode === Mode.FIXED
    let { moveableOptions = {} } = this.workshop.config
    if (typeof moveableOptions === 'function') {
      moveableOptions = moveableOptions(this.workshop)
    }

    const elementGuidelines: any = moveableOptions.elementGuidelines || this.target.parentElement?.children || []

    this.setElementGuidelines(elementGuidelines)

    if (moveableOptions.elementGuidelines) {
      delete moveableOptions.elementGuidelines
    }
    return {
      origin: false,
      rootContainer: this.workshop.container,
      zoom: 1,
      dragArea: false,
      draggable: true,
      resizable: true,
      scalable: false,
      rotatable: false,
      snappable: isAbsolute || isFixed,
      snapGap: isAbsolute || isFixed,
      snapThreshold: 5,
      snapDigit: 0,
      throttleDrag: 0,
      isDisplaySnapDigit: isAbsolute,
      snapDirections: {
        top: isAbsolute,
        right: isAbsolute,
        bottom: isAbsolute,
        left: isAbsolute,
        center: isAbsolute,
        middle: isAbsolute,
      },
      elementSnapDirections: {
        top: isAbsolute,
        right: isAbsolute,
        bottom: isAbsolute,
        left: isAbsolute,
      },
      isDisplayInnerSnapDigit: true,
      horizontalGuidelines: this.horizontalGuidelines,
      verticalGuidelines: this.verticalGuidelines,
      elementGuidelines: this.elementGuidelines,
      bounds: {
        top: 0,
        right: this.container.clientWidth,
        bottom: this.container.clientHeight,
        left: -1,
      },
      ...options,
      ...moveableOptions,
    }
  }

  private initMoveable(): void {
    this.moveable?.destroy()
    this.moveable = new Moveable(this.container, {
      ...this.moveableOptions,
    })
    this.bindResizeEvent()
    this.bindDragEvent()
    this.bindRotateEvent()
    this.bindScaleEvent()
  }

  private bindResizeEvent(): void {
    if (!this.moveable) {
      throw new Error('This moveable is not initialization')
    }

    const frame = {
      left: 0,
      top: 0,
    }

    this.moveable.on('resizeStart', (event) => {
      if (!this.target) {
        return
      }
      this.dragStatus = ActionStatus.START
      this.moveableHelper?.onResizeStart(event)

      frame.top = this.target.offsetTop
      frame.left = this.target.offsetLeft
    })

    this.moveable.on('resize', (event) => {
      if (!this.moveable || !this.target || !this.dragElement) {
        return
      }
      const { width, height, drag } = event
      const { beforeTranslate } = drag
      this.dragStatus = ActionStatus.ING
      this.moveableHelper?.onResize(event)

      if (this.mode === Mode.SORTABLE) {
        this.target.style.top = `0px`
      } else {
        this.target.style.left = `${frame.left + beforeTranslate[0]}px`
        this.target.style.top = `${frame.top + beforeTranslate[1]}px`
      }

      this.target.style.width = `${width}px`
      this.target.style.height = `${height}px`
    })

    this.moveable.on('resizeEnd', () => {
      this.dragStatus = ActionStatus.END
      this.update(true)
    })
  }

  private bindDragEvent(): void {
    if (!this.moveable) {
      throw new Error('This moveable is not initialization')
    }

    const frame = {
      left: 0,
      top: 0,
    }

    let timeout: any

    const { contentWindow } = this.workshop.renderer
    const doc = contentWindow?.document

    this.moveable.on('dragStart', (event) => {
      if (!this.target) {
        throw new Error('No select any element')
      }
      this.dragStatus = ActionStatus.START
      this.moveableHelper?.onDragStart(event)
      if (this.mode === Mode.SORTABLE) {
        this.ghostElement = this.generateGhostElement(this.target)
      }
      frame.top = this.target.offsetTop
      frame.left = this.target.offsetLeft
    })

    this.moveable.on('drag', (event) => {
      if (!this.target || !this.dragElement) {
        return
      }
      if (timeout) {
        globalThis.clearTimeout(timeout)
        timeout = undefined
      }
      timeout = globalThis.setTimeout(async () => {
        const elements = this.workshop.getElementFromPoint(event.inputEvent)
        for (const element of elements) {
          if (
            doc &&
            !element.id.startsWith('ghost_el_') &&
            element !== this.target &&
            (await this.workshop.isContainer(element))
          ) {
            dom.addClassName(element, doc, this.workshop.highlightContainer.className)
            break
          }
        }
      }, this.workshop.highlightContainer.duration)
      this.dragStatus = ActionStatus.ING

      if (this.ghostElement) {
        this.ghostElement.style.top = `${frame.top + event.beforeTranslate[1]}px`
        return
      }

      this.moveableHelper?.onDrag(event)

      this.target.style.left = `${frame.left + event.beforeTranslate[0]}px`
      this.target.style.top = `${frame.top + event.beforeTranslate[1]}px`
    })

    this.moveable.on('dragEnd', () => {
      if (timeout) {
        globalThis.clearTimeout(timeout)
        timeout = undefined
      }

      let parentElement: HTMLElement | null = null
      if (doc) {
        parentElement = dom.removeClassNameByClassName(doc, this.workshop.highlightContainer.className)
      }

      if (this.dragStatus === ActionStatus.ING) {
        if (parentElement) {
          this.update(false, parentElement)
        } else {
          this.update()
        }
      }
      this.dragStatus = ActionStatus.END
      this.destroyGhostElement()
    })
  }

  private bindRotateEvent(): void {
    if (!this.moveable) {
      throw new Error('This moveable is not initialization')
    }

    this.moveable.on('rotateStart', (event) => {
      this.dragStatus = ActionStatus.START
      this.moveableHelper?.onRotateStart(event)
    })

    this.moveable.on('rotate', (event) => {
      if (!this.target || !this.dragElement) {
        return
      }
      this.dragStatus = ActionStatus.ING
      this.moveableHelper?.onRotate(event)
      const frame = this.moveableHelper?.getFrame(event.target)
      this.target.style.transform = frame?.toCSSObject().transform || ''
    })

    this.moveable.on('rotateEnd', (event) => {
      this.dragStatus = ActionStatus.END
      const frame = this.moveableHelper?.getFrame(event.target)
      this.fire('update', {
        element: this.target,
        style: {
          transform: frame?.get('transform'),
        },
      })
    })
  }

  private bindScaleEvent(): void {
    if (!this.moveable) {
      throw new Error('This moveable is not initialization')
    }

    this.moveable.on('scaleStart', (event) => {
      this.dragStatus = ActionStatus.START
      this.moveableHelper?.onScaleStart(event)
    })

    this.moveable.on('scale', (event) => {
      if (!this.target || !this.ghostElement) {
        return
      }
      this.dragStatus = ActionStatus.ING
      this.moveableHelper?.onScale(event)
      const frame = this.moveableHelper?.getFrame(event.target)
      this.target.style.transform = frame?.toCSSObject().transform || ''
    })

    this.moveable.on('scaleEnd', (event) => {
      this.dragStatus = ActionStatus.END
      const frame = this.moveableHelper?.getFrame(event.target)
      this.fire('update', {
        element: this.target,
        style: {
          transform: frame?.get('transform'),
        },
      })
    })
  }

  private generateGhostElement(element: HTMLElement): HTMLElement {
    if (this.ghostElement) {
      this.destroyGhostElement()
    }
    const ghostElement = element.cloneNode(true) as HTMLElement
    const { top, left } = dom.getAbsolutePosition(element, dom.getElementOffset(element))
    ghostElement.id = `ghost_el_id_${element.id}`
    ghostElement.style.zIndex = ZIndex.GHOST_EL
    ghostElement.style.opacity = '0.5'
    ghostElement.style.position = 'absolute'
    ghostElement.style.left = `${left}px`
    ghostElement.style.top = `${top}px`
    element.after(ghostElement)
    return ghostElement
  }

  private setElementGuidelines(nodes: HTMLElement[]): void {
    this.elementGuidelines.forEach((el) => {
      el.remove()
    })
    this.elementGuidelines = []
    if ((this.mode = Mode.ABSOLUTE)) {
      this.container.append(this.createGuidelineElements(nodes))
    }
  }

  private createGuidelineElements(nodes: HTMLElement[]): DocumentFragment {
    const frame = globalThis.document.createDocumentFragment()
    for (const node of nodes) {
      const { width, height } = node.getBoundingClientRect()
      if (node === this.target) {
        continue
      }
      const { left, top } = dom.getElementOffset(node as HTMLElement)
      const elementGuideline = globalThis.document.createElement('div')
      elementGuideline.style.cssText = `position: absolute; width: ${width}px; height: ${height}px; top: ${top}px; left: ${left}px;`
      this.elementGuidelines.push(elementGuideline)
      frame.append(elementGuideline)
    }
    return frame
  }

  private update(isResize = false, parentElement: HTMLElement | null = null): void {
    if (!this.target) {
      return
    }

    const { contentWindow } = this.workshop.renderer
    const doc = contentWindow?.document
    if (!doc) {
      return
    }

    const offset =
      this.mode === Mode.SORTABLE ? { left: 0, top: 0 } : { left: this.target.offsetLeft, top: this.target.offsetTop }

    let left = calculateValueByFontsize(doc, offset.left)
    let top = calculateValueByFontsize(doc, offset.top)
    const width = calculateValueByFontsize(doc, this.target.clientWidth)
    const height = calculateValueByFontsize(doc, this.target.clientHeight)

    if (parentElement && this.mode === Mode.ABSOLUTE && this.dragElement) {
      if (this.moveableHelper?.getFrame(this.dragElement).properties) {
        const transform = this.moveableHelper?.getFrame(this.dragElement).properties
        const [translateX, translateY] = transform.translate.value
        const { left: parentLeft, top: parentTop } = dom.getElementOffset(parentElement)
        left =
          calculateValueByFontsize(doc, this.dragElement.offsetLeft) +
          parseFloat(translateX) -
          calculateValueByFontsize(doc, parentLeft)
        top =
          calculateValueByFontsize(doc, this.dragElement.offsetTop) +
          parseFloat(translateY) -
          calculateValueByFontsize(doc, parentTop)
      }
    }

    this.fire('update', {
      element: this.target,
      parentElement,
      style: isResize ? { left, top, width, height } : { left, top },
    })
  }
}

export default DragBox
