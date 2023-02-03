import { getCurrentInstance, inject, onMounted, onUnmounted, onUpdated } from 'vue';

import Core from '@edoms/core';
import { Callback, MNodeInstance } from '@edoms/schema';
import { EdomsRequestFunc } from '@edoms/utils';

import useCommonMethod from './useCommonMethod';

export default (props: any) => {
  const app = inject<Core | undefined>('app');
  const node = app?.page?.getNode(props.config.id);
  const request = inject<EdomsRequestFunc | undefined>('request');

  const instance: MNodeInstance = {};

  node?.emit('created', instance);

  onMounted(() => {
    const vm = getCurrentInstance()?.proxy;
    if (vm) {
      instance.$el = vm.$el;
    }
    node?.emit('mounted', instance);
  });

  onUpdated(() => {
    node?.emit('updated', instance);
  });

  onUnmounted(() => {
    node?.emit('destroy');
  });

  const provideMethod = (methodName: string, callback: Callback, depends?: string[] | undefined): Callback => {
    if (!instance.methods) {
      instance.methods = {
        ...useCommonMethod(props),
      };
    }
    if (depends) {
      callback.__depends__ = depends;
    }
    instance.methods[methodName] = callback;
    return callback;
  };

  return {
    app,
    node,
    provideMethod,
    request,
  };
};
