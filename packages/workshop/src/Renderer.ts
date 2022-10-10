import { Engine } from '@edoms/engine'
import { EdApplication, EdId, EdMeta } from '@edoms/meta-model'
import { EventBus, url } from '@edoms/utils'
import Workshop from './Workshop'

interface InsertData {
  meta: EdMeta
  app: EdApplication
}

interface UpdateData {
  meta: EdMeta
  app: EdApplication
}

interface DeleteData {
  id: EdId
  app: EdApplication
}

interface Runtime {
  getEngine?: () => Engine
  beforeSelect?: (element: HTMLElement) => Promise<boolean> | boolean
  select?: (id: EdId) => Promise<HTMLElement> | HTMLElement
  updateAppMeta?: (meta: EdApplication) => void
  updateCurrentPage?: (id: EdId) => void
  insert?: (data: InsertData) => void
  update?: (data: UpdateData) => void
  delete?: (data: DeleteData) => void
}

interface Edoms {
  onRuntimeReady: (runtime: Runtime) => void
}

interface RuntimeWindow extends Window {
  edoms: Edoms
}

class WorkshopRenderer extends EventBus {
  public workshop: Workshop

  public iframe?: HTMLIFrameElement

  public contentWindow?: RuntimeWindow

  public runtime?: Runtime

  public runtimeUrl?: string

  private render?: (workshop: Workshop) => Promise<HTMLElement> | HTMLElement

  constructor(workshop: Workshop) {
    super()

    this.workshop = workshop
    this.runtimeUrl = workshop.config.runtimeUrl
    this.render = workshop.config.render

    this.iframe = window.document.createElement('iframe')
    let iframeSrc = ''
    if (this.runtimeUrl && url.isSameDomain(this.runtimeUrl)) {
      iframeSrc = this.runtimeUrl
    }
    this.iframe.src = iframeSrc
    this.iframe.style.cssText = `border: 0; width: 100%; height: 100%;`
    this.iframe.addEventListener('load', this.loadHandler)
  }

  public async mount(element: HTMLDivElement): Promise<void> {
    if (!this.iframe) {
      throw Error('iframe元素不存在，挂载失败')
    }
    if (this.runtimeUrl && !url.isSameDomain(this.runtimeUrl)) {
      const html = await fetch(this.runtimeUrl).then((res) => res.text())
      this.iframe.srcdoc = html.replace(
        `<head>`,
        `<head> \n <base href="${globalThis.location.protocol}//${url.getHost(this.runtimeUrl)}">`
      )
    }
    element.appendChild(this.iframe)
  }

  public destroy(): void {
    this.iframe?.removeEventListener('load', this.loadHandler)
    this.contentWindow = undefined
    this.iframe?.remove()
    this.iframe = undefined
    this.removeAllListeners()
  }

  public getRuntime(): Promise<Runtime> {
    if (this.runtime) {
      return Promise.resolve(this.runtime)
    }
    return new Promise((resolve) => {
      this.once('runtime-ready', (runtime: Runtime) => {
        resolve(runtime)
      })
    })
  }

  public generateEdoms(): Edoms {
    return {
      onRuntimeReady: (runtime: Runtime) => {
        this.runtime = runtime
        this.fire('runtime-ready', runtime)
      },
    }
  }

  private loadHandler = async () => {
    this.contentWindow = this.iframe?.contentWindow as RuntimeWindow

    this.contentWindow.edoms = this.generateEdoms()

    if (this.render) {
      const rootElement = await this.render(this.workshop)
      if (rootElement) {
        this.iframe?.contentDocument?.body.appendChild(rootElement)
      }
    }

    this.fire('onload')

    this.contentWindow.postMessage(
      {
        edomsRuntimeLoaded: true,
      },
      '*'
    )
  }
}

export default WorkshopRenderer
