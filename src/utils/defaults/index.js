// Vue won't get included in bundle as it is externalized
// https://cli.vuejs.org/guide/build-targets.html#library
import Vue from 'vue';
import { isObject, defaultsDeep, mapValues, get, has } from '../_';
import touch from './touch.json';
import masks from './masks.json';
import screens from './screens.json';
import locales from './locales';

const pluginDefaults = {
  componentPrefix: 'v',
  navVisibility: 'click',
  titlePosition: 'center',
  transition: 'slide-h',
  touch,
  masks,
  screens,
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
  methods: {
    propOrDefault(prop, defaultPath, strategy) {
      return this.passedProp(prop, get(this.$defaults, defaultPath), strategy);
    },
    passedProp(prop, fallback, strategy) {
      if (has(this.$options.propsData, prop)) {
        const propValue = this[prop];
        if (isObject(propValue) && strategy === 'merge') {
          return defaultsDeep(propValue, fallback);
        }
        return propValue;
      }
      return fallback;
    },
  },
};
