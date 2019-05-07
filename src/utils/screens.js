import {
  isString,
  isArray,
  isUndefined,
  map,
  mapValues,
  toPairs,
  has,
  get,
} from '@/utils/_';

// This function gratuitously borrowed from Tailwindcss
// https://github.com/tailwindcss/tailwindcss/blob/master/src/util/buildMediaQuery.js
const buildMediaQuery = screens => {
  // Default min width
  if (isString(screens)) {
    screens = { min: screens };
  }
  // Wrap in array
  if (!isArray(screens)) {
    screens = [screens];
  }
  return screens
    .map(screen => {
      if (has(screen, 'raw')) {
        return screen.raw;
      }
      return map(screen, (value, feature) => {
        feature = get(
          {
            min: 'min-width',
            max: 'max-width',
          },
          feature,
          feature,
        );
        return `(${feature}: ${value})`;
      }).join(' and ');
    })
    .join(', ');
};

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
