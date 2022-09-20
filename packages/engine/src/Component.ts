import { EdAction, EdComponent, EdContainer, EdPage } from '@edoms/components'
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
  public instance: any

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
  }
}

export default Component
