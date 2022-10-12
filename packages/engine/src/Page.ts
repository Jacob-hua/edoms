import { EdComponent, EdContainer, EdPage } from '@edoms/meta-model'
import App from './App'
import Component from './Component'
import { PageProps } from './type'

class Page extends Component {
  public components = new Map<string, Component>()
  public data: EdPage
  public app: App

  constructor(props: PageProps) {
    super(props)

    this.data = props.meta
    this.app = props.app
    this.init()
  }

  /**
   * init方法会将Page所有的组件都在page中打平后以ID为key记录到map中
   */
  public init(): void {
    const initComponent = (data: Array<EdComponent | EdContainer>, parent: Component) => {
      data.forEach((meta: EdComponent | EdContainer) => {
        const component = new Component({
          meta,
          parent,
          app: this.app,
          page: this,
        })

        this.setComponent(meta.id, component)

        meta.children && initComponent(meta.children, component)
      })
    }

    initComponent(this.data.children, this)
  }

  public setComponent(id: string, component: Component): void {
    this.components.set(id, component)
  }

  public getComponent(id: string): Component | undefined {
    return this.components.get(id)
  }

  public deleteComponent(id: string): void {
    this.components.delete(id)
  }
}

export default Page
