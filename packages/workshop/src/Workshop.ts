import { EventBus } from '@edoms/utils'
import { MoveableOptions } from 'moveable'
import DragBox from './DragBox'
import Highlight from './Highlight'
import Mask from './Mask'
import Renderer from './Renderer'
import { addSelectedClassName, removeSelectedClassName } from './utils'

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
  autoScrollIntoView?: boolean
}

class Workshop extends EventBus {
  public container?: HTMLDivElement
  public selectedDom: HTMLElement | undefined
  public selectedDomArray: HTMLElement[] | undefined
  public renderer: Renderer
  public mask: Mask
  public dragBox: DragBox
  public highlightLayer: Highlight
  public zoom: number = 0
  public config: WorkshopConfig
  public isContainer: IsContainer
  public highlightContainer: HighlightContainer

  constructor(config: WorkshopConfig) {
    super()
    this.config = config
    this.setZoom(config.zoom)
    this.isContainer = config.isContainer
    this.highlightContainer = config.highlightContainer

    this.renderer = new Renderer(this)
    this.mask = new Mask(this)
    this.dragBox = new DragBox({
      workshop: this,
      container: this.mask.content,
      mask: this.mask,
    })
    this.highlightLayer = new Highlight({
      workshop: this,
      container: this.mask.wrapper,
    })

    this.renderer.on('runtime-ready', (runtime: any) => {
      this.fire('runtime-read', runtime)
    })

    this.renderer.on('page-el-update', (element: HTMLElement) => {
      this.mask.observe(element)
    })

    this.mask.on('beforeSelect', async (event: MouseEvent) => {
      this.clearSelectStatus()
      const element = await this.setElementFromPoint(event)
      if (!element) {
        return
      }
      this.select(element, event)
    })

    this.mask.on('select', () => {
      this.fire('select', this.selectedDom)
    })

    this.mask.on('changeGuides', (data: any) => {
      this.fire('changeGuides', data)
    })

    this.mask.on('highlight', () => {})

    this.mask.on('clearHighlight', () => {})

    this.dragBox.on('update', (data: any) => {
      setTimeout(() => {
        this.fire('update', data)
      })
    })
  }

  public async select(idOrEl: string | HTMLElement, event?: MouseEvent): Promise<void> {
    const element = await this.getTargetElement(idOrEl)
    if (element === this.selectedDom) {
      return
    }

    const runtime = await this.renderer.getRuntime()

    await runtime?.select?.(element.id)

    if (runtime.beforeSelect) {
      await runtime.beforeSelect(element)
    }

    this.mask.setLayout(element)
    this.dragBox.select(element, event)

    if (this.config.autoScrollIntoView) {
      this.mask.intersectionObserver?.observe(element)
    }

    this.selectedDom = element

    if (this.renderer.contentWindow) {
      removeSelectedClassName(this.renderer.contentWindow.document)
      if (this.selectedDom) {
        addSelectedClassName(this.selectedDom, this.renderer.contentWindow.document)
      }
    }
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

  public setZoom(zoom: number = 1) {
    this.zoom = zoom
  }

  public clearSelectStatus() {
    this.dragBox.clearSelectStatus()
  }

  public async setElementFromPoint(event: MouseEvent, type?: string): Promise<HTMLElement | undefined> {
    const elements = this.getElementsFromPoint(event)
    const stopped = false
    for (const element of elements) {
      if (!element.id.startsWith('ghost_el_')) {
        if (stopped) {
          break
        }
        if (event.type === type) {
          return element
        }
        return element
      }
    }
    return
  }

  public getElementsFromPoint(event: MouseEvent): HTMLElement[] {
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

  public async getTargetElement(target: string | HTMLElement): Promise<HTMLElement> {
    if (typeof target === 'string') {
      const el = this.renderer.contentWindow?.document.getElementById(`${target}`)
      if (!el) {
        throw new Error(`id是${target}的元素不存在`)
      }
      return el
    }
    return target
  }
}

export default Workshop
