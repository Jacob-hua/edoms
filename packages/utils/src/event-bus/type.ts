export interface Listener {
  _fun: Function
  priority: number
  _isTomb?: boolean
  next?: Listener
}

export interface InternalEventData {
  [key: string]: any
}
