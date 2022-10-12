export interface Listener {
  _fun: Function;
  priority: number;
  _isTomb?: boolean;
  next?: Listener;
}
