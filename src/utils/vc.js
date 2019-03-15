import Locale from '@/utils/locale';

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
      getLocale({ id, firstDayOfWeek, masks }) {
        let locale = this.locales[id];
        if (!locale) {
          locale = new Locale({ id, firstDayOfWeek, masks });
          this.locales[id] = locale;
        }
        return locale;
      },
    },
  });
