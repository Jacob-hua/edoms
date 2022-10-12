import { EdAction, EdApplication } from '@edoms/meta-model'
import { EventBus, object } from '@edoms/utils'
import Page from './Page'
import { generateEffectProps, generateEventName } from './utils'
import { ActionCache, AppProps, FromInstance } from './type'

class App extends EventBus {
  public pages = new Map<string, Page>()

  public actionCacheMap = new Map<string, ActionCache[]>()

  public page: undefined | Page

  public context = {} as Record<string, any>

  constructor(props: AppProps) {
    super()
    props.meta && this.setMeta(props.meta)
  }

  public setMeta(meta: EdApplication): void {
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

    this.setPage()
  }

  public setContext(path: string | number | symbol, value: any): void {
    object.setByPath(this.context, path, value)
  }

  public getContext(path: string, defaultValue?: any): any {
    return object.getByPath(this.context, path, defaultValue)
  }

  public contextHas(path: string): boolean {
    return object.hasByPath(this.context, path)
  }

  public setPage(id?: string): void {
    if (id) {
      this.page = this.pages.get(id)
    }

    if (!this.page) {
      this.page = this.pages.get(this.pages.keys().next().value)
    }

    this.bindActions()
  }

  private bindActions(): void {
    if (!this.page) {
      return
    }

    this.removeAllListeners()

    this.page.components.forEach(({ actions, instance, data: { id: fromId } }) => {
      if (!actions) {
        return
      }
      actions.forEach((action) => {
        this.bindAction(action, instance, fromId)
      })
    })
  }

  public bindAction(action: EdAction, instance: FromInstance, id: string) {
    const actionName = generateEventName(action.name, id)
    this.on(actionName, (...args: any) => this.actionHandler(action, instance, id, args))
  }

  public actionHandler(action: EdAction, fromInstance: FromInstance, fromId: string, args: any[]): void {
    if (!this.page) {
      throw new Error('当前页面为空')
    }

    const { target, effect } = action

    const targetComponent = this.page.getComponent(target)

    if (!targetComponent) {
      throw new Error(`${target}组件不存在`)
    }

    if (targetComponent.instance) {
      if (object.typeOf(targetComponent.instance.effects[effect], Function)) {
        targetComponent.instance.effects[effect](generateEffectProps(action))
      }
    } else {
      // 如果此时目标组件实例未创建，需要将对应的事件缓存，当实例创建后刷新缓存事件
      this.cacheAction({
        action,
        fromInstance,
        fromId,
        args,
      })
    }
  }

  public cacheAction(actionCache: ActionCache) {
    if (!this.actionCacheMap.get(actionCache.action.target)) {
      this.actionCacheMap.set(actionCache.action.target, [])
    }
    this.actionCacheMap.get(actionCache.action.target)?.push(actionCache)
  }

  public clear() {
    this.removeAllListeners()
    this.page = undefined
    this.pages.clear()
    this.actionCacheMap.clear()
  }
}

export default App
