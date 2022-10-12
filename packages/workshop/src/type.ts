import Workshop from './WorkShop'
import Mask from './Mask'
import DragBox from './DragBox'
import { MoveableOptions } from 'moveable'
import { EdApplication, EdMeta, EdId } from '@edoms/meta-model'
import { Engine } from '@edoms/engine'

export type IsContainer = (element: HTMLElement) => boolean | Promise<boolean>

export interface HighlightContainer {
  className: string
  duration: number
}

export interface WorkshopConfig {
  zoom?: number
  runtimeUrl?: string
  highlightContainer: HighlightContainer
  render?: () => Promise<HTMLElement> | HTMLElement
  updateDragElement?: (element: HTMLDivElement, target: HTMLElement) => void
  moveableOptions?: ((workshop: Workshop) => MoveableOptions) | MoveableOptions
  isContainer: IsContainer
  autoScrollIntoView?: boolean
}

export interface InsertData {
  meta: EdMeta
  app: EdApplication
}

export interface UpdateData {
  meta: EdMeta
  app: EdApplication
}

export interface DeleteData {
  id: EdId
  app: EdApplication
}

export interface Runtime {
  getEngine?: () => Engine
  beforeSelect?: (element: HTMLElement) => Promise<boolean> | boolean
  select?: (id: EdId) => Promise<HTMLElement> | HTMLElement
  updateAppMeta?: (meta: EdApplication) => void
  updateCurrentPage?: (id: EdId) => void
  insert?: (data: InsertData) => void
  update?: (data: UpdateData) => void
  delete?: (data: DeleteData) => void
}

export interface Edoms {
  onRuntimeReady: (runtime: Runtime) => void
}

export interface RuntimeWindow extends Window {
  edoms: Edoms
}

export interface TargetCalibrateProps {
  parentElement: HTMLElement
  mask: Mask
  dragBox: DragBox
  workshop: Workshop
}

export interface Offset {
  left: number
  top: number
}

export interface HighlightProps {
  workshop: Workshop
  container: HTMLElement
}

export interface DragBoxProps {
  workshop: Workshop
  container: HTMLElement
  mask: Mask
}
