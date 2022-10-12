import { EdAction, EdComponent, EdContainer, EdInstance, EdPage } from '@edoms/meta-model';
import { EventBus, object } from '@edoms/utils';
import App from './App';
import Page from './Page';
import { ComponentProps } from './type';

class Component extends EventBus {
  public data: EdComponent | EdContainer | EdPage;
  public app: App;
  public instance: EdInstance | null | undefined;

  public parent?: Component;
  public page?: Page;
  public actions?: EdAction[];

  public context = {} as Record<string | number | symbol, any>;

  constructor(props: ComponentProps) {
    super();

    this.app = props.app;
    this.data = props.meta;
    props.meta.actions && (this.actions = props.meta.actions);
    props.parent && (this.parent = props.parent);
    props.page && (this.page = props.page);

    this.lifecycle();

    this.once('destroyed', () => {
      this.instance = null;
      this.lifecycle();
    });
  }

  private lifecycle(): void {
    this.once('created', (instance: EdInstance) => {
      this.instance = instance;
    });

    this.once('mounted', (instance: EdInstance) => {
      this.instance = instance;
      this.handleContext(instance);
      const actionCacheMap = this.app.actionCacheMap.get(this.data.id) || [];
      let actionCache = actionCacheMap.shift();
      while (actionCache) {
        this.app.actionHandler(actionCache.action, actionCache.fromInstance, actionCache.fromId, actionCache.args);
        actionCache = actionCacheMap.shift();
      }
    });
  }

  public handleContext(instance: EdInstance): void {
    if (!instance.config) {
      return;
    }
    // TODO: 此处需要考虑多组件暴露context属性名重复问题
    Object.keys(instance.config.context).forEach((scope) => {
      if (scope === 'application') {
        for (const key in instance.config.context.application) {
          this.app.setContext(key, instance.config.context.application[key]);
        }
      } else if (scope === 'component') {
        for (const key in instance.config.context.component) {
          this.setContext(key, instance.config.context.component[key]);
        }
      } else if (scope === 'page') {
        for (const key in instance.config.context.page) {
          this.page?.setContext(key, instance.config.context.page[key]);
        }
      }
    });
  }

  public setContext(path: string | number | symbol, value: any): void {
    object.setByPath(this.context, path, value);
  }

  public getContext(path: string | number | symbol): any {
    return object.getByPath(this.context, path);
  }
}

export default Component;
