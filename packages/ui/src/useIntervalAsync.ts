import { onUnmounted, ref } from 'vue';

import { TimeUnit, toMilliseconds } from '@edoms/utils';

export type Cleanup = () => any;

type CallbackReturn = void | Cleanup;

export type Callback = (...args: any[]) => CallbackReturn | Promise<CallbackReturn>;

export default (callback: Callback, delay: number, unit: TimeUnit = 'second') => {
  const timeout = ref<number | null>(null);
  const canceled = ref<boolean>(false);
  const cleanup = ref<Cleanup | void>();

  delay = toMilliseconds(delay, unit);

  const run: TimerHandler = async () => {
    if (canceled.value) {
      return;
    }
    if (typeof cleanup.value === 'function') {
      cleanup.value();
    }
    cleanup.value = await Promise.resolve(callback());
    timeout.value = globalThis.setTimeout(run, delay);
  };

  run();

  const flush = () => {
    timeout.value && globalThis.clearTimeout(timeout.value);
    run();
  };

  const cancel = () => {
    timeout.value && globalThis.clearTimeout(timeout.value);
    canceled.value = true;
    if (typeof cleanup.value === 'function') {
      cleanup.value();
    }
  };

  onUnmounted(() => {
    cancel();
  });

  return {
    flush,
    cancel,
  };
};
