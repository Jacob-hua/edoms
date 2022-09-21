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

export interface Menu<T = any> {
  iconSize: number
  iconColor: string
  icon: string
  name: string
  action: (event: T) => void
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
