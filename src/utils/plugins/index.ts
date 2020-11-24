import { App as Application, Component } from 'vue';
import { Defaults } from '../defaults';
import { get } from '../_';

export const registerComponent = (
  instance: Application,
  component: Component,
  defaults: Defaults = {},
) => {
  if (component) {
    const prefix = get(defaults, 'componentPrefix', '');
    instance.component(`${prefix}${component.name}`, component);
  }
};

export const registerComponentProgrammatic = (
  instance: Application,
  property: string,
  component: Component,
) => {
  if (!instance.config.globalProperties.$test)
    instance.config.globalProperties.$test = {};
  instance.config.globalProperties.$test[property] = component;
};
