import { ref, watchEffect } from 'vue';

export type Callback = (...args: any[]) => any;

export default (callback: Callback, delay: number) => {
  const running = ref<boolean>(false);
  const timeout = ref<number | null>(null);
  const mounted = ref<boolean>(false);

  const run: TimerHandler = async () => {
    running.value = true;
    const result = await callback();
    running.value = false;
    if (mounted.value && running.value === false) {
      timeout.value = globalThis.setTimeout(run, delay);
    }
    return result;
  };

  watchEffect((onCancel) => {
    mounted.value = true;
    run();
    onCancel(() => {
      mounted.value = false;
      timeout.value && globalThis.clearTimeout(timeout.value);
    });
  });

  const flush = () => {
    timeout.value && globalThis.clearTimeout(timeout.value);
    running.value = false;
    return run();
  };

  return flush;
};
