// Vue won't get included in bundle as it is externalized
// https://cli.vuejs.org/guide/build-targets.html#library
import Vue from 'vue';
import { defaultsDeep, mapValues } from '@/utils/_';
import touch from './touch.json';
import masks from './masks.json';
import screens from './screens.json';
import theme from './theme';
import locales from './locales';

const pluginDefaults = {
  componentPrefix: 'v',
  navVisibility: 'click',
  titlePosition: 'center',
  transition: 'slide-h',
  touch,
  masks,
  screens,
  theme,
  locales,
  datePicker: {
    updateOnInput: true,
    inputDebounce: 1000,
    popover: {
      visibility: 'hover-focus',
      placement: 'bottom-start',
      keepVisibleOnInput: false,
    },
  },
};

let defaults_ = null;

export const setupDefaults = opts => {
  if (!defaults_) {
    defaults_ = new Vue({
      data() {
        return {
          defaults: defaultsDeep(opts, pluginDefaults),
        };
      },
      computed: {
        locales() {
          return mapValues(this.defaults.locales, v => {
            v.masks = defaultsDeep(v.masks, this.defaults.masks);
            return v;
          });
        },
      },
    });
  }
  return defaults_.defaults;
};

export const defaultsMixin = {
  beforeCreate() {
    setupDefaults();
  },
  computed: {
    $defaults() {
      return defaults_.defaults;
    },
    $locales() {
      return defaults_.locales;
    },
  },
};
