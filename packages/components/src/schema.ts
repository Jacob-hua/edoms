export interface EComponent {
  id: string
  name: string
  type: string | 'container' | 'page' | 'app'
  [key: string]: any
}

export interface EContainer extends EComponent {
  type: 'container' | string
  children: (EComponent | EContainer)[]
}

export interface EPage extends EContainer {
  type: 'page'
}

export interface EApplication extends EComponent {
  type: 'app'
  pages: EPage[]
}

export type ENode = EComponent | EContainer | EPage | EApplication
