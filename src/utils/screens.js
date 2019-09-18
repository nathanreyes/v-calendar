import buildMediaQuery from '@/utils/buildMediaQuery';
import { isUndefined, mapValues, toPairs, has } from '@/utils/_';


export const setupScreens = (Vue, screens) => {
  if (!screens) return;
  let setup = false;
  // Use a private Vue component to store reactive screen matches
  const screenComp = new Vue({
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

  Vue.mixin({
    mounted() {
      if (!setup) {
        screenComp.refreshQueries();
        setup = true;
      }
    },
    computed: {
      $screens() {
        // Return function that re-evaluates every time screen matches change
        return (config, def) =>
          screenComp.matches.reduce(
            (prev, curr) => (has(config, curr) ? config[curr] : prev),
            isUndefined(def) ? config.default : def,
          );
      },
    },
  });
};
