export type EffectType = 'dark' | 'light'

export type PlacementType =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end'
  | 'right'
  | 'right-start'
  | 'right-end'

export interface Menu {
  iconSize: number
  iconColor: string
  icon: string
  name: string
  action: (event: any) => void
}

export interface GridViewMenu<T> extends Menu {
  action: (data: T) => void
}

export interface TileProps {
  effect?: EffectType
  contentStyle?: Record<string, any>
  linesClamp?: number
  placement?: PlacementType
}

export interface Space {
  horizontal?: string
  vertical?: string
}
