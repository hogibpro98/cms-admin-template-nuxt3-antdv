import { createI18n } from 'vue-i18n';
import cloneDepp from 'lodash/cloneDeep';
// Add language support below
import index from '~/locales/index';
export default defineNuxtPlugin(({ vueApp }) => {
  const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: 'ja',
    // Importing language files
    messages: cloneDepp(index)
  });

  vueApp.use(i18n);
});
