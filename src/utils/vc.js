import Locale from '@/utils/locale';
import { isString, defaultsDeep } from '@/utils/_';

export const createVC = (Vue, defaults) =>
  new Vue({
    data() {
      return {
        defaults,
        locales: {},
        activeRefs: {},
      };
    },
    computed: {
      formats() {
        return this.defaults.formats;
      },
      theme() {
        return this.defaults.theme;
      },
    },
    methods: {
      getLocale(locale) {
        const meta = this.getLocaleMeta(locale);
        locale = this.locales[meta.id];
        if (!locale) {
          locale = new Locale(meta);
          this.locales[meta.id] = locale;
        }
        return locale;
      },
      getLocaleMeta(locale) {
        // Set default locale id if needed
        if (!locale) {
          locale = new Intl.DateTimeFormat().resolvedOptions().locale;
        }
        // Configure with locale id
        if (isString(locale)) {
          const { locales } = this.defaults;
          const { firstDayOfWeek, dow, masks, L } =
            locales[locale] || locales[locale.substring(0, 2)] || {};
          locale = {
            id: locale,
            firstDayOfWeek: firstDayOfWeek || dow,
            masks: masks || { L },
          };
          // Configure with object and locale id
        } else if (isObject(locale)) {
          defaultsDeep(locale, this.defaults.locales[locale.id]);
        }
        // Set defaults values if missing
        return defaultsDeep(locale, {
          firstDayOfWeek: 1,
          masks: { L: 'DD/MM/YYYY' },
        });
      },
    },
  });
