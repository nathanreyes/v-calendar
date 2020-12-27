import { App, reactive } from 'vue';
import buildMediaQuery from './buildMediaQuery';
import defaultScreens from './defaults/screens.json';
import {
  defaultsDeep,
  isUndefined,
  mapValues,
  toPairs,
  isFunction,
  has,
} from './_';

declare const window: any;

interface ScreensState {
  matches: Array<any>;
  queries: object;
}

export default {
  install: (app: App, screens: object | undefined) => {
    screens = defaultsDeep(
      screens,
      window && window.__screens__,
      defaultScreens,
    );

    let shouldRefreshQueries = true;
    const state = reactive<ScreensState>({
      matches: [],
      queries: [],
    });

    const refreshMatches = () => {
      state.matches = toPairs(state.queries)
        .filter((p: Array<any>) => p[1].matches)
        .map((p: Array<any>) => p[0]);
    };

    const refreshQueries = () => {
      if (!shouldRefreshQueries || !window || !window.matchMedia) return;
      state.queries = mapValues(screens, (v: string) => {
        const query = window.matchMedia(buildMediaQuery(v));
        if (isFunction(query.addEventListener)) {
          query.addEventListener('change', refreshMatches);
        } else {
          // Deprecated 'MediaQueryList' API, < Safari 14, < Edge 16
          query.addListener(refreshMatches);
        }
        return query;
      });
      shouldRefreshQueries = false;
      refreshMatches();
    };

    // Global mixin that
    // 1) Refreshes queries on first component mount
    // 2) Provides '$screens' utility method that refreshes any time the screen matches update
    app.mixin({
      mounted() {
        refreshQueries();
      },
      computed: {
        $screens(): Function {
          return (config: any, def: any) =>
            state.matches.reduce(
              (prev, curr) => (has(config, curr) ? config[curr] : prev),
              isUndefined(def) ? config.default : def,
            );
        },
      },
    });
  },
};
