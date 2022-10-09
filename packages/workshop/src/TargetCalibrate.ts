import { EventBus } from '@edoms/utils'
import DragBox from './DragBox'
import { Mode } from './enum'
import Mask from './Mask'
import { getMode } from './utils'
import Workshop from './WorkShop'

interface TargetCalibrateProps {
  parentElement: HTMLElement
  mask: Mask
  dragBox: DragBox
  workshop: Workshop
}

export interface Offset {
  left: number
  top: number
}

class TargetCalibrate extends EventBus {
  public parentElement: HTMLElement
  public mask: Mask
  public dragBox: DragBox
  public workshop: Workshop
  public operationElement: HTMLDivElement

  constructor(props: TargetCalibrateProps) {
    super()

    this.parentElement = props.parentElement
    this.mask = props.mask
    this.dragBox = props.dragBox
    this.workshop = props.workshop

    this.operationElement = document.createElement('div')
    this.parentElement.append(this.operationElement)
  }

  public update(element: HTMLElement, prefix: string): HTMLElement {
    const { left, top } = this.getOffset(element)
    const { transform } = getComputedStyle(element)
    this.operationElement.style.cssText = `
      position: absolute;
      transform: ${transform};
      left: ${left}px;
      top: ${top}px;
      width: ${element.clientWidth}px;
      height: ${element.clientHeight}px;
    `
    this.operationElement.id = `${prefix}_${element.id}`
    if (typeof this.workshop.config.updateDragElement === 'function') {
      this.workshop.config.updateDragElement(this.operationElement, element)
    }
    return this.operationElement
  }

  public destroy() {
    this.operationElement.remove()
  }

  private getOffset(element: HTMLElement): Offset {
    const left = element.offsetLeft
    const top = element.offsetTop

    const { offsetParent } = element
    if (offsetParent) {
      const parentOffset = this.getOffset(offsetParent as HTMLElement)
      return {
        left: left + parentOffset.left,
        top: top + parentOffset.top,
      }
    }

    if (this.dragBox.mode === Mode.FIXED) {
      if (getMode(element) === Mode.FIXED) {
        return {
          left,
          top,
        }
      }
      return {
        left: left - this.mask.scrollLeft,
        top: top - this.mask.scrollTop,
      }
    }
    if (getMode(element) === Mode.FIXED) {
      return {
        left: left + this.mask.scrollLeft,
        top: top + this.mask.scrollTop,
      }
    }
    return {
      left,
      top,
    }
  }
}

export default TargetCalibrate
