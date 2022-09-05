export interface EdComponent {
  id: string
  name: string
  type: string | 'container' | 'page' | 'app'
  [key: string]: any
}

export interface EdContainer extends EdComponent {
  type: 'container' | string
  children: (EdComponent | EdContainer)[]
}

export interface EdPage extends EdContainer {
  type: 'page'
}

export interface EdApplication extends EdComponent {
  type: 'app'
  pages: EdPage[]
}

export type EdNode = EdComponent | EdContainer | EdPage | EdApplication
