import { EventBus } from '@edoms/utils'
import { MoveableOptions } from 'moveable'
import Renderer from './Renderer'

export type IsContainer = (element: HTMLElement) => boolean | Promise<boolean>

interface HighlightContainer {
  className: string
  duration: number
}

interface WorkshopConfig {
  zoom?: number
  runtimeUrl?: string
  highlightContainer: HighlightContainer
  render?: () => Promise<HTMLElement> | HTMLElement
  updateDragElement?: (element: HTMLDivElement, target: HTMLElement) => void
  moveableOptions?: ((workshop: Workshop) => MoveableOptions) | MoveableOptions
  isContainer: IsContainer
}

class Workshop extends EventBus {
  public container?: HTMLDivElement
  public zoom: number = 0
  public config: WorkshopConfig
  public isContainer: IsContainer
  public highlightContainer: HighlightContainer

  public renderer: Renderer

  constructor(config: WorkshopConfig) {
    super()
    this.config = config
    this.setZoom(config.zoom)
    this.isContainer = config.isContainer
    this.highlightContainer = config.highlightContainer

    this.renderer = new Renderer(this)
  }

  public getElementFromPoint(event: MouseEvent) {
    const { renderer, zoom } = this
    const doc = renderer.contentWindow?.document
    let x = event.clientX
    let y = event.clientY
    if (renderer.iframe) {
      const rect = renderer.iframe.getClientRects()[0]
      if (rect) {
        x = x - rect.left
        y = y - rect.top
      }
    }
    return doc?.elementsFromPoint(x / zoom, y / zoom) as HTMLElement[]
  }

  public setZoom(zoom: number = 9999) {
    this.zoom = zoom
  }
}

export default Workshop
