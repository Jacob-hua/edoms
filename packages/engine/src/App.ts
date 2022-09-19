import { EdAction, EdApplication, EdPage } from '@edoms/components'
import { EventBus } from '@edoms/utils'

interface AppProps {
  meta?: EdApplication
  currentPage?: string
  designWidth?: number
}

class App extends EventBus {
  public pages = new Map<string, EdPage>()

  public designWidth: number = 1920

  public components = new Map<string, any>()

  public page: EdPage | undefined

  constructor(props: AppProps) {
    super()
    props.designWidth && (this.designWidth = props.designWidth)
  }

  public setMeta(meta: EdApplication, curPage?: string) {
    this.pages = new Map<string, EdPage>()
    if (meta.pages) {
      meta.pages.forEach((page) => {
        this.pages.set(page.id, page)
      })
    }

    this.setPage(curPage || this.page?.id)
  }

  public setPage(id?: string) {
    if (id) {
      this.page = this.pages.get(id)
    }

    if (!this.page) {
      this.page = this.pages.get(this.pages.keys().next().value)
    }
  }

  public registerComponent(type: string, component: any) {
    this.components.set(type, component)
  }

  public deleteComponent(type: string) {
    this.components.delete(type)
  }

  public getComponent(type: string) {
    return this.components.get(type)
  }

  public bindEvents() {
    if (!this.page) {
      return
    }

    this.removeAllListeners()

    this.page.children.forEach((meta) => {
      meta.actions?.forEach((action) => this.bindEvent(action, meta.id))
    })
  }

  public bindEvent(action: EdAction, id: string) {
    return {
      action,
      id,
    }
  }
}

export default App
