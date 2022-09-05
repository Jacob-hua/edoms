import { EdText } from '@/schema'
import { ComponentPublicInstance } from 'vue'

export interface Props {
  node: EdText
}

export type Instance = ComponentPublicInstance | null | undefined
