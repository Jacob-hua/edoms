import { onUnmounted, ref } from 'vue';

export type Callback = (...args: any[]) => any;

export default (callback: Callback, delay: number) => {
  const timeout = ref<number | null>(null);
  const mounted = ref<boolean>(false);

  const run: TimerHandler = async () => {
    const result = await callback();
    if (mounted.value) {
      timeout.value = globalThis.setTimeout(run, delay);
    }
    return result;
  };

  mounted.value = true;
  run();

  const flush = () => {
    timeout.value && globalThis.clearTimeout(timeout.value);
    return run();
  };

  const cancel = () => {
    timeout.value && globalThis.clearTimeout(timeout.value);
    mounted.value = false;
  };

  onUnmounted(() => {
    cancel();
  });

  return {
    flush,
    cancel,
  };
};
