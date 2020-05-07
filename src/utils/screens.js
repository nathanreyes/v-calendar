// Vue won't get included in bundle as it is externalized
// https://cli.vuejs.org/guide/build-targets.html#library
import Vue from 'vue';
import buildMediaQuery from './buildMediaQuery';
import defaultScreens from './defaults/screens.json';
import { isUndefined, mapValues, toPairs, has } from './_';

let isSettingUp = false;
let shouldRefreshQueries = false;
let screensComp = null;

export function setupScreens(screens = defaultScreens, forceSetup) {
  if ((screensComp && !forceSetup) || isSettingUp) {
    return;
  }
  isSettingUp = true;
  shouldRefreshQueries = true;
  // Use a private Vue component to store reactive screen matches
  screensComp = new Vue({
    data() {
      return {
        matches: [],
        queries: [],
      };
    },
    methods: {
      refreshQueries() {
        this.queries = mapValues(screens, v => {
          const query = window.matchMedia(buildMediaQuery(v));
          query.addListener(this.refreshMatches);
          return query;
        });
        this.refreshMatches();
      },
      refreshMatches() {
        this.matches = toPairs(this.queries)
          .filter(p => p[1].matches)
          .map(p => p[0]);
      },
    },
  });
  isSettingUp = false;
}

// Global mixin that provides responsive '$screens' utility method
// that refreshes any time the screen matches update
Vue.mixin({
  beforeCreate() {
    if (!isSettingUp) {
      setupScreens();
    }
  },
  mounted() {
    if (shouldRefreshQueries && screensComp) {
      screensComp.refreshQueries();
      shouldRefreshQueries = false;
    }
  },
  computed: {
    $screens() {
      return (config, def) =>
        screensComp.matches.reduce(
          (prev, curr) => (has(config, curr) ? config[curr] : prev),
          isUndefined(def) ? config.default : def,
        );
    },
  },
});
