import { App, generateEventName } from '@edoms/engine'
import { EdMeta, EdInstance } from '@edoms/meta-model'
import { inject, onMounted, onUnmounted } from 'vue'

export interface AppProps extends EdInstance {
  meta: EdMeta
}

export default (props: AppProps) => {
  const app: App | undefined = inject('app')
  const component = app?.page?.getComponent(props.meta.id)

  component?.fire('created', props)

  onMounted(() => {
    component?.fire('mounted', props)
  })

  onUnmounted(() => {
    component?.fire('destroyed', props)
  })

  function fire(actionName: string, ...args: any[]) {
    app?.fire(generateEventName(actionName, props.meta.id), ...args)
  }

  return {
    fire,
  }
}
