import { EdApplication } from '@edoms/components'
import { EventBus } from '@edoms/utils'
import Page from './Page'

interface AppProps {
  meta?: EdApplication
  curPage?: string
}

class App extends EventBus {
  public pages = new Map<string, Page>()

  public page: undefined | Page

  constructor(props: AppProps) {
    super()
    props.meta && this.setMeta(props.meta)
  }

  public setMeta(meta: EdApplication) {
    this.pages = new Map()
    meta.pages.forEach((page) => {
      this.pages.set(
        page.id,
        new Page({
          meta: page,
          app: this,
        })
      )
    })
  }

  public setPage(id?: string) {
    if (id) {
      this.page = this.pages.get(id)
    }

    if (!this.page) {
      this.page = this.pages.get(this.pages.keys().next().value)
    }
  }

  public bindEvents() {
    if (!this.page) {
      return
    }

    this.removeAllListeners()
    // TODO: 绑定事件，也就是将组件中定义的actions一一在app中监听
  }
}

export default App
