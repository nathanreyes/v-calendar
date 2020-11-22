import { App as Application } from 'vue';

const config = {};

export { config as default };

export let VueInstance: Application;

export const setVueInstance = (instance: Application) => {
  VueInstance = instance;
};
