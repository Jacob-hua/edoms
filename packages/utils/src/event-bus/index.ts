import { InternalEventData, Listener } from './type'

export class InternalEvent {
  public type: string
  public cancelBubble: boolean
  public defaultPrevented: boolean
  public timeStamp: number
  public result?: any
  public data?: InternalEventData

  constructor(type: string, data?: InternalEventData) {
    this.data = data
    this.type = type
    this.timeStamp = Date.now()
    this.cancelBubble = false
    this.defaultPrevented = false
  }

  public stopPropagation() {
    this.cancelBubble = true
  }

  public preventDefault() {
    this.defaultPrevented = true
  }
}

class EventBus {
  private listeners: Map<string, Listener | undefined>

  constructor() {
    this.listeners = new Map()
  }

  public on(type: string, callback: Function, priority: number = 0): void {
    this.addListener(type, {
      _fun: callback,
      priority,
    })
  }

  public once(type: string, callback: Function, priority: number = 0): void {
    const wrappedCallback = (...args: any[]) => {
      const result = callback.apply(null, args)
      this.off(type, wrappedCallback)
      return result
    }

    this.on(type, wrappedCallback, priority)
  }

  public off(type: string, callback?: Function) {
    this.removeListener(type, callback)
  }

  public fire(type: string, data?: InternalEvent | InternalEventData): boolean | undefined {
    let result = undefined
    const firstListener = this.getListener(type)
    if (!firstListener) {
      return result
    }

    if (!(data instanceof InternalEvent)) {
      data = this.createEvent(type, data)
    }

    const event = data as InternalEvent
    event.timeStamp = Date.now()
    const originalType = event.type
    if (type !== originalType) {
      event.type = type
    }
    const args = Array.prototype.slice.call(arguments)
    args[0] = event
    try {
      result = this.invokeListeners(event, args, firstListener)
    } finally {
      if (type !== originalType) {
        event.type = originalType
      }
    }

    if (result === undefined && event.defaultPrevented) {
      result = false
    }
    return result
  }

  public handleError(error: Error) {
    return this.fire('error', { error })
  }

  public createEvent(type: string, data?: InternalEventData): InternalEvent {
    return new InternalEvent(type, data)
  }

  private addListener(type: string, newListener: Listener): void {
    let listener: Listener | undefined = this.getListener(type)

    if (!listener) {
      this.setListener(type, newListener)
      return
    }

    let preListener: Listener | undefined = undefined
    while (listener) {
      if (listener.priority < newListener.priority) {
        newListener.next = listener
        if (preListener) {
          preListener.next = newListener
        } else {
          this.setListener(type, newListener)
        }
        return
      }
      preListener = listener
      listener = listener.next
    }

    if (preListener) {
      preListener.next = newListener
    }
  }

  private removeListener(type: string, callback?: Function) {
    let listener = this.getListener(type)
    if (!callback) {
      this.setListener(type)
    }

    let nextListener: Listener | undefined
    let preListener: Listener | undefined
    let listenerCallback: Function
    while (listener) {
      nextListener = listener.next
      listenerCallback = listener._fun

      if (listenerCallback === callback) {
        if (preListener) {
          preListener.next = nextListener
        } else {
          this.setListener(type, nextListener)
        }
      }

      preListener = listener
      listener = nextListener
    }
  }

  private getListener(type: string): Listener | undefined {
    return this.listeners.get(type)
  }

  private setListener(type: string, listener?: Listener): void {
    this.listeners.set(type, listener)
  }

  private invokeListeners(event: InternalEvent, args: any[], listener?: Listener) {
    let result = undefined
    while (listener) {
      if (event.cancelBubble) {
        break
      }
      if (listener._isTomb) {
        return result
      }

      try {
        result = listener._fun.apply(null, args)
        if (result !== undefined) {
          event.result = result
          event.stopPropagation()
        }

        if (result === false) {
          event.preventDefault()
        }
      } catch (error) {
        if (!this.handleError(error as Error)) {
          console.error('unhandled error in event listener', error)
          throw error
        }
      }
      listener = listener.next
    }
    return result
  }
}

export default EventBus
