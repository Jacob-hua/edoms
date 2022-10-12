import { Engine, generateEventName } from '@edoms/engine';
import { EdMeta, EdInstance, EdContextScope } from '@edoms/meta-model';
import { inject, onMounted, onUnmounted } from 'vue';

export interface AppProps {
  meta: EdMeta;
}

export default (props: AppProps) => {
  const app: Engine | undefined = inject('app');
  const component = app?.page?.getComponent(props.meta.id);

  const instance: EdInstance = {
    effects: {},
    config: {
      linkageDefine: {
        actionProps: [],
        effectProps: [],
      },
      context: {
        application: {},
        page: {},
        component: {},
      },
    },
  };

  component?.fire('created', instance);

  onMounted(() => {
    component?.fire('mounted', instance);
  });

  onUnmounted(() => {
    component?.fire('destroyed');
  });

  function fire(actionName: string, ...args: any[]): void {
    app?.fire(generateEventName(actionName, props.meta.id), ...args);
  }

  function provideEffect(key: string, effect: Function): void {
    instance.effects[key] = effect;
  }

  function provideContext(path: string | number | symbol, value: any, scopes?: EdContextScope[]): void {
    if (!scopes) {
      scopes = ['component'];
    }

    const scopeClassifier = {
      ['application']: () => {
        instance.config.context.application[path] = value;
      },
      ['page']: () => {
        instance.config.context.page[path] = value;
      },
      ['component']: () => {
        instance.config.context.component[path] = value;
      },
    };

    scopes.forEach((scope) => {
      scopeClassifier[scope]();
    });
    component?.handleContext(instance);
  }

  return {
    fire,
    provideEffect,
    provideContext,
  };
};
