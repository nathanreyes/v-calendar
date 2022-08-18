import { App, reactive, computed } from 'vue';
import { defaultsDeep, mapValues, get, has } from '../_';
import touch from './touch.json';
import masks from './masks.json';
import locales from './locales';
import { DarkModeConfig } from '../../use/darkMode';

declare const window: any;

interface DatePickerPopoverDefaults {
  visibility?: string;
  placement?: string;
  keepVisibleOnInput?: boolean;
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
  componentPrefix: '',
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
      keepVisibleOnInput: false,
      isInteractive: true,
    },
  },
};

const state = reactive(defaultConfig);

const computedLocales = computed(() => {
  return mapValues(state.locales, (v: any) => {
    v.masks = defaultsDeep(v.masks, state.masks);
    return v;
  });
});

export { computedLocales as locales };

export const getDefault = (path: string) => {
  if (window && has(window.__vcalendar__, path)) {
    return get(window.__vcalendar__, path);
  }
  return get(state, path);
};

export const setupDefaults = (app: App, userDefaults: Defaults | undefined) => {
  app.config.globalProperties.$VCalendar = state;
  return Object.assign(state, defaultsDeep(userDefaults, state));
};
