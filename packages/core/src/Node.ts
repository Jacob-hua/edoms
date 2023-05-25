import { EventEmitter } from 'events';

import type { EventItemConfig, MComponent, MContainer, MNodeInstance, MPage } from '@edoms/schema';

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
  public instance?: MNodeInstance;
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
      this.instance = undefined;
      this.off('updated', this.updateInstance);
      if (typeof this.data.destroy === 'function') {
        this.data.destroy(this);
      }

      this.listenLifeSafe();
    });
  }

  private listenLifeSafe() {
    this.once('created', async (instance: MNodeInstance) => {
      this.instance = instance;
    });

    this.once('mounted', async (instance: MNodeInstance) => {
      this.instance = instance;

      const eventConfigQueue = this.app.eventQueueMap[this.data.id] || [];

      for (let eventConfig = eventConfigQueue.shift(); eventConfig; eventConfig = eventConfigQueue.shift()) {
        this.app.eventHandler(eventConfig.eventConfig, eventConfig.fromCpt, eventConfig.props);
      }
    });

    this.on('updated', this.updateInstance);
  }

  public updateInstance(instance?: MNodeInstance) {
    this.instance = instance;
  }
}

export default Node;
