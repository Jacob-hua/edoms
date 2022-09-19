import { EdAction, EdComponent, EdContainer } from '@edoms/components'
import { EventBus, InternalEvent } from '@edoms/utils'
import App from './App'
import Page from './Page'

interface NodeProps {
  app: App
  node: EdContainer | EdComponent
  page?: Page
  parent?: Node
}

class Node extends EventBus {
  public app: App
  public parent?: Node
  public data: EdComponent | EdContainer
  public actions?: EdAction[]
  public vm?: any

  constructor(props: NodeProps) {
    super()

    this.app = props.app
    this.data = props.node
    this.parent = props.parent
    this.actions = props.node.actions
  }

  private lifeSafe() {
    this.once('created', (event: InternalEvent) => {
      this.vm = event.data?.vm
    })
    this.once('mounted', (event: InternalEvent) => {
      this.vm = event.data?.vm
    })
  }
}

export default Node
