import { ref } from 'vue';
export const i18n = ref<any>(null);
export const useI18n = () => {
  return {
    t:
      i18n.value?.global.t ??
      ((str: string) => {
        str;
      }),
  };
};

export default useI18n;
