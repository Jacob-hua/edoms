import { EventBus } from '@edoms/utils'
import Renderer from './Renderer'

interface WorkshopConfig {
  zoom?: number
  runtimeUrl?: string
  render?: () => Promise<HTMLElement> | HTMLElement
}

class Workshop extends EventBus {
  public config: WorkshopConfig

  public renderer: Renderer

  constructor(config: WorkshopConfig) {
    super()
    this.config = config

    this.renderer = new Renderer(this)
  }
}

export default Workshop
