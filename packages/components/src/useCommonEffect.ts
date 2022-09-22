import { EdComponent } from '@edoms/meta-model'

export default (node: EdComponent) => {
  return {
    show: () => {
      if (node.style) {
        node.style.display = 'initial'
      }
    },
    hide: () => {
      if (node.style) {
        node.style.display = 'none'
      }
    },
  }
}
