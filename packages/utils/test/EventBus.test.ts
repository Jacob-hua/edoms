import { beforeEach, describe, expect, test } from 'vitest'
import EventBus, { InternalEvent } from '../src/event-bus'

interface LocalContext {
  eventBus: EventBus
}

describe('EventBus 测试', () => {
  beforeEach<LocalContext>((context) => {
    context.eventBus = new EventBus()
  })

  test<LocalContext>('事件携带参数', ({ eventBus }) => {
    eventBus.on('test', (event: InternalEvent) => {
      expect(event.data).toEqual({ name: 3333 })
    })
    eventBus.on(
      'test',
      (event: InternalEvent) => {
        expect(event.data).toEqual({ name: 3333 })
      },
      10
    )
    const result = eventBus.fire('test', { name: 3333 })
    console.log(result)
  })

  test<LocalContext>('阻止事件传递', ({ eventBus }) => {
    eventBus.on('test', (event: InternalEvent) => {
      expect(event.data).toEqual({ name: 3333 })
    })
    eventBus.on(
      'test',
      (event: InternalEvent) => {
        expect(event.data).toEqual({ name: 3333 })
        return false
      },
      10
    )
    eventBus.on(
      'test',
      (event: InternalEvent) => {
        expect(event.data).toEqual({ name: 3333 })
        return false
      },
      11
    )
    const result = eventBus.fire('test', { name: 3333 })
    console.log(result)
  })

  test<LocalContext>('监听一次事件触发', ({ eventBus }) => {
    eventBus.on('test', (event: InternalEvent) => {
      expect(event.data).toEqual({ name: 3333 })
    })
    eventBus.on(
      'test',
      (event: InternalEvent) => {
        expect(event.data).toEqual({ name: 3333 })
        console.log('执行低优先级')

        return false
      },
      10
    )
    eventBus.once(
      'test',
      (_: any, data: any) => {
        console.log(data)

        expect(data).toEqual({ name: 3333 })
        console.log('只执行一次高优先级')
      },
      11
    )
    eventBus.fire('test', { name: 3333 })
    eventBus.fire('test', { name: 3333 })
  })
})
