import { EventEmitter } from 'events';

import { isEmpty } from 'lodash-es';

import type { EventItemConfig, MComponent, MContainer, MPage } from '@edoms/schema';

import type App from './App';
import type Page from './Page';
import Store from './Store';

interface NodeOptions {
  config: MComponent | MContainer;
  page?: Page;
  parent?: Node;
  app: App;
}
class Node extends EventEmitter {
  public data: MComponent | MContainer | MPage;
  public style?: {
    [key: string]: any;
  };
  public events?: EventItemConfig[];
  public instance?: any;
  public page?: Page;
  public parent?: Node;
  public app: App;
  public store = new Store();

  constructor(options: NodeOptions) {
    super();

    this.page = options.page;
    this.parent = options.parent;
    this.app = options.app;
    const { events } = options.config;
    this.data = options.config;
    this.events = events;
    this.listenLifeSafe();

    this.once('destroy', () => {
      this.instance = null;
      if (typeof this.data.destroy === 'function') {
        this.data.destroy(this);
      }

      this.listenLifeSafe();
    });
  }

  private listenLifeSafe() {
    this.once('created', async (instance: any) => {
      this.instance = instance;
      await this.runCodeBlock('created');
    });

    this.once('mounted', async (instance: any) => {
      this.instance = instance;

      const eventConfigQueue = this.app.eventQueueMap[this.data.id] || [];

      for (let eventConfig = eventConfigQueue.shift(); eventConfig; eventConfig = eventConfigQueue.shift()) {
        this.app.eventHandler(eventConfig.eventConfig, eventConfig.fromCpt, eventConfig.args);
      }

      await this.runCodeBlock('mounted');
    });
  }

  private async runCodeBlock(hook: string) {
    if (!Array.isArray(this.data[hook]) || !this.app.codeDsl || isEmpty(this.app?.codeDsl)) return;
    for (const codeId of this.data[hook]) {
      if (this.app.codeDsl[codeId] && typeof this.app?.codeDsl[codeId]?.content === 'function') {
        await this.app.codeDsl[codeId].content(this);
      }
    }
  }
}

export default Node;
