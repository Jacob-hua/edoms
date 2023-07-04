import { createI18n } from 'vue-i18n';

import en from './en';
import zhCN from './zh-CN';

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('lang') ?? navigator.language,
  messages: {
    en,
    zh_CN: zhCN,
  },
});

export default i18n;
