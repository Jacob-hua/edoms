import type { MApp } from '@edoms/schema';

export const getLocalConfig = (): MApp[] => {
  const configStr = localStorage.getItem('edomsDSL');
  if (!configStr) return [];
  try {
    // eslint-disable-next-line no-eval
    return [eval(`(${configStr})`)];
  } catch (err) {
    return [];
  }
};
