import { App } from '@edoms/engine'
import { inject, onMounted, onUnmounted } from 'vue'
import { EdMeta, EdInstance } from './schema'

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

  return app
}
