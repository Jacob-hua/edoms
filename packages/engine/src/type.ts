import { EdAction, EdApplication, EdComponent, EdContainer, EdInstance, EdPage } from '@edoms/meta-model';
import App from './App';
import Component from './Component';
import Page from './Page';

export interface AppProps {
  meta?: EdApplication;
  curPage?: string;
}

export type FromInstance = EdInstance | null | undefined;

export interface ActionCache {
  action: EdAction;
  fromId: string;
  fromInstance: FromInstance;
  args: any;
}

export interface PageProps {
  meta: EdPage;
  app: App;
}

export interface ComponentProps {
  app: App;
  meta: EdComponent | EdContainer;
  parent?: Component;
  page?: Page;
}
