import { isString, isArray, map, has, get } from './_';

interface Screen {
  raw?: any;
}

// This function gratuitously borrowed from TailwindCSS
// https://github.com/tailwindcss/tailwindcss/blob/master/src/util/buildMediaQuery.js
export default function buildMediaQuery(screens: any) {
  // Default min width
  if (isString(screens)) {
    screens = { min: screens };
  }
  // Wrap in array
  if (!isArray(screens)) {
    screens = [screens];
  }
  return (screens as Array<Screen>)
    .map((screen: Screen) => {
      if (has(screen, 'raw')) {
        return screen.raw;
      }
      return map(screen, (value: string, feature: string) => {
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
}
