import { EdComponent, EdContainer, EdPage } from '@edoms/components'
import App from './App'
import Node from './Node'

interface PageProps {
  app: App
  node: EdPage
}

class Page extends Node {
  public nodes = new Map<string, Node>()

  constructor(props: PageProps) {
    super(props)
    this.setNode(props.node.id, this)
  }

  public initNode(config: EdComponent | EdContainer, parent: Node) {
    const node = new Node({
      node: config,
      parent,
      page: this,
      app: this.app,
    })

    this.setNode(config.id, node)
  }

  public setNode(id: string, node: Node) {
    this.nodes.set(id, node)
  }

  public getNode(id: string) {
    return this.nodes.get(id)
  }

  public deleteNode(id: string) {
    this.nodes.delete(id)
  }
}

export default Page
