import { inject, onMounted, onUnmounted } from 'vue';

import Core from '@edoms/core';
import { Callback, MNodeInstance } from '@edoms/schema';

import useCommonMethod from './useCommonMethod';

export default (props: any) => {
  const app: Core | undefined = inject('app');
  const node = app?.page?.getNode(props.config.id);

  const instance: MNodeInstance = {
    methods: {
      ...useCommonMethod(props),
    },
  };

  node?.emit('created', instance);

  onMounted(() => {
    node?.emit('mounted', instance);
  });

  onUnmounted(() => {
    node?.emit('destroy');
  });

  const provideMethod = (method: string, callback: Callback): void => {
    instance.methods[method] = callback;
  };

  return {
    app,
    provideMethod,
  };
};
