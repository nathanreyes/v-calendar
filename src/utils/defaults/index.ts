import { type App, reactive, computed } from 'vue';
import type { DarkModeConfig } from 'vue-screen-utils';
import { defaultsDeep, mapValues, get, has } from '../helpers';
import touch from './touch.json';
import masks from './masks.json';
import locales from './locales';

declare const window: any;

interface DatePickerPopoverDefaults {
  visibility?: string;
  placement?: string;
  isInteractive?: boolean;
}

interface DatePickerDefaults {
  updateOnInput?: boolean;
  inputDebounce?: number;
  popover?: DatePickerPopoverDefaults;
}

export interface Defaults {
  componentPrefix?: string;
  color?: string;
  isDark?: DarkModeConfig;
  navVisibility?: string;
  titlePosition?: string;
  transition?: string;
  touch?: object;
  masks?: object;
  locales?: any;
  datePicker?: DatePickerDefaults;
}

const defaultConfig: Defaults = {
  componentPrefix: 'V',
  color: 'blue',
  isDark: false,
  navVisibility: 'click',
  titlePosition: 'center',
  transition: 'slide-h',
  touch,
  masks,
  locales,
  datePicker: {
    updateOnInput: true,
    inputDebounce: 1000,
    popover: {
      visibility: 'hover-focus',
      placement: 'bottom-start',
      isInteractive: true,
    },
  },
};

const state = reactive(defaultConfig);

const defaultLocales = computed(() => {
  return mapValues(state.locales, (l: any) => {
    l.masks = defaultsDeep(l.masks, state.masks);
    return l;
  });
});

export { defaultLocales };

export const getDefault = (path: string) => {
  if (typeof window !== 'undefined' && has(window.__vcalendar__, path)) {
    return get(window.__vcalendar__, path);
  }
  return get(state, path);
};

export const setupDefaults = (app: App, userDefaults: Defaults | undefined) => {
  app.config.globalProperties.$VCalendar = state;
  return Object.assign(state, defaultsDeep(userDefaults, state));
};
