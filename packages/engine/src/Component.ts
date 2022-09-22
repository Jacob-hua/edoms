import { EdAction, EdComponent, EdContainer, EdInstance, EdPage } from '@edoms/meta-model'
import { EventBus } from '@edoms/utils'
import App from './App'
import Page from './Page'

interface ComponentProps {
  app: App
  meta: EdComponent | EdContainer
  parent?: Component
  page?: Page
}

class Component extends EventBus {
  public data: EdComponent | EdContainer | EdPage
  public app: App
  public instance: EdInstance | null | undefined

  public parent?: Component
  public page?: Page
  public actions?: EdAction[]

  constructor(props: ComponentProps) {
    super()

    this.app = props.app
    this.data = props.meta
    props.meta.actions && (this.actions = props.meta.actions)
    props.parent && (this.parent = props.parent)
    props.page && (this.page = props.page)

    this.lifecycle()

    this.once('destroyed', () => {
      this.instance = null
      this.lifecycle()
    })
  }

  private lifecycle(): void {
    this.once('created', (instance: EdInstance) => {
      this.instance = instance
    })

    this.once('mounted', (instance: EdInstance) => {
      this.instance = instance
      const actionCacheMap = this.app.actionCacheMap.get(this.data.id) || []
      let actionCache = actionCacheMap.shift()
      while (actionCache) {
        this.app.actionHandler(actionCache.action, actionCache.fromInstance, actionCache.fromId, actionCache.args)
        actionCache = actionCacheMap.shift()
      }
    })
  }
}

export default Component
