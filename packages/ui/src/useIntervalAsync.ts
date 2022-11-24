import { ref, watchEffect } from 'vue';

export default <R = unknown>(callback: () => Promise<R>, delay: number) => {
  // 是否存在正在执行的任务
  const runningCount = ref<number>(0);
  const timeout = ref<number | null>(null);
  const mounted = ref<boolean>(false);

  const next = (handler: TimerHandler) => {
    if (mounted.value && runningCount.value === 0) {
      timeout.value = globalThis.setTimeout(handler, delay);
    }
  };

  const run = async () => {
    runningCount.value += 1;
    const result = await callback();
    runningCount.value -= 1;

    next(run);
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
    return run();
  };

  return flush;
};
