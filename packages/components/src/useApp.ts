import { App, generateEventName } from '@edoms/engine'
import { EdMeta, EdInstance } from '@edoms/meta-model'
import { inject, onMounted, onUnmounted } from 'vue'

export interface AppProps {
  meta: EdMeta
}

export default (props: AppProps) => {
  const app: App | undefined = inject('app')
  const component = app?.page?.getComponent(props.meta.id)

  const instance: EdInstance = {
    effects: {},
  }

  component?.fire('created', instance)

  onMounted(() => {
    component?.fire('mounted', instance)
  })

  onUnmounted(() => {
    component?.fire('destroyed')
  })

  function fire(actionName: string, ...args: any[]): void {
    app?.fire(generateEventName(actionName, props.meta.id), ...args)
  }

  function provideEffect(key: string, effect: Function): void {
    instance.effects[key] = effect
  }

  function provideContext(path: string, value: any): void {
    component?.page?.setContext(path, value)
  }

  function provideGlobalContext(path: string, value: any): void {
    app?.setContext(path, value)
  }

  return {
    fire,
    provideEffect,
    provideContext,
    provideGlobalContext,
  }
}
