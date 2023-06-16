import { createI18n } from 'vue-i18n';

import en from './en';
import zhCN from './zh-CN';

const lang = (navigator.language || 'en').toLocaleLowerCase();

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('lang') || lang.split('-')[0] || 'en',
  globalInjection: true,
  messages: {
    en,
    zhCN,
  },
});

export default i18n;
