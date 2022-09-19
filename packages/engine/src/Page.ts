import { EdComponent, EdContainer, EdPage } from '@edoms/components'
import App from './App'
import Node from './Node'

interface PageProps {
  app: App
  meta: EdPage
}

class Page extends Node {
  public nodes = new Map<string, Node>()

  constructor(props: PageProps) {
    super(props)
    this.setNode(props.meta.id, this)
  }

  public initNode(meta: EdComponent | EdContainer, parent: Node) {
    const node = new Node({
      meta: meta,
      parent,
      page: this,
      app: this.app,
    })

    this.setNode(meta.id, node)
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
