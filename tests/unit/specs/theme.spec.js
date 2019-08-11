import Theme from '@/utils/theme';
import defaultsDeep from 'lodash/defaultsDeep';

const defThemeConfig = {
  color: 'blue',
  isDark: false,
  highlightBaseFillMode: 'light',
  highlightStartEndFillMode: 'solid',
  highlightStartEndClass: 'vc-rounded-full',
  bgLow: {
    light: 'vc-bg-white vc-border-2 vc-border-{color}-700',
    dark: 'vc-bg-gray-900 vc-border-2 vc-border-{color}-200',
  },
  bgAccentLow: {
    light: `vc-bg-{color}-200`,
    dark: `vc-bg-{color}-800 vc-opacity-75`,
  },
  bgAccentHigh: {
    light: `vc-bg-{color}-600`,
    dark: `vc-bg-{color}-500`,
  },
  contentAccent: {
    light: `vc-font-bold vc-text-{color}-900`,
    dark: `vc-font-bold vc-text-{color}-100`,
  },
  contentAccentContrast: 'vc-font-bold vc-text-white',
};

function getDefaultHighlight(theme) {
  return {
    base: {
      color: theme.color,
      isDark: theme.isDark,
      fillMode: theme.highlightBaseFillMode,
      class: theme.getHighlightBgClass(theme.highlightBaseFillMode),
      contentClass: theme.getHighlightContentClass(theme.highlightBaseFillMode),
    },
    start: {
      color: theme.color,
      isDark: theme.isDark,
      fillMode: theme.highlightStartEndFillMode,
      class: `${theme.highlightStartEndClass} ${theme.getHighlightBgClass(
        theme.highlightStartEndFillMode,
      )}`,
      contentClass: theme.getHighlightContentClass(
        theme.highlightStartEndFillMode,
      ),
    },
    end: {
      color: theme.color,
      isDark: theme.isDark,
      fillMode: theme.highlightStartEndFillMode,
      class: `${theme.highlightStartEndClass} ${theme.getHighlightBgClass(
        theme.highlightStartEndFillMode,
      )}`,
      contentClass: theme.getHighlightContentClass(
        theme.highlightStartEndFillMode,
      ),
    },
  };
}

describe.only('Theme', () => {
  it('should normalize highlight w/ true', () => {
    const theme = new Theme(defThemeConfig);
    const normConfig = theme.normalizeHighlight(true);
    expect(normConfig).toEqual(getDefaultHighlight(theme));
  });

  it('should normalize highlight w/ false', () => {
    const theme = new Theme({ ...defThemeConfig });
    const normConfig = theme.normalizeHighlight(false);
    expect(normConfig).toEqual(null);
  });

  it('should normalize highlight w/ theme color', () => {
    const color = 'red';
    const theme = new Theme(defThemeConfig);
    const redTheme = new Theme({ ...defThemeConfig, color: 'red' });
    const normConfig = theme.normalizeHighlight(color);
    expect(normConfig).toEqual(getDefaultHighlight(redTheme));
  });

  it('should normalize highlight w/ target boolean', () => {
    const theme = new Theme(defThemeConfig);
    const normConfig = theme.normalizeHighlight({ base: true });
    expect(normConfig).toEqual(getDefaultHighlight(theme));
  });

  it('should normalize highlight w/ target theme color', () => {
    const color = 'red';
    const theme = new Theme(defThemeConfig);
    const redTheme = new Theme({ ...defThemeConfig, color });
    const normConfig = theme.normalizeHighlight({ base: color });
    expect(normConfig).toEqual({
      ...getDefaultHighlight(theme),
      base: getDefaultHighlight(redTheme).base,
    });
  });

  it('should normalize highlight w/ class', () => {
    const theme = new Theme(defThemeConfig);
    const className = 'class-1 class-2';
    const normConfig = theme.normalizeHighlight({
      class: className,
    });
    const defHighlight = getDefaultHighlight(theme);
    expect(normConfig).toEqual(
      defaultsDeep(
        {
          base: {
            class: `${className} ${defHighlight.base.class}`,
          },
          start: {
            class: `${className} ${defHighlight.start.class}`,
          },
          end: {
            class: `${className} ${defHighlight.end.class}`,
          },
        },
        defHighlight,
      ),
    );
  });

  it('should normalize highlight w/ mixed target configurations', () => {
    const theme = new Theme({
      ...defThemeConfig,
      highlightStartEndFillMode: 'light',
    });
    const redTheme = new Theme({
      ...defThemeConfig,
      color: 'red',
      highlightStartEndFillMode: 'light',
    });
    const normConfig = theme.normalizeHighlight({
      base: true,
      start: {
        color: 'red',
        fillMode: 'light',
      },
      end: {
        class: 'class-1 class-2',
        fillMode: 'light',
      },
    });
    const defHighlight = getDefaultHighlight(theme);
    const redHighlight = getDefaultHighlight(redTheme);
    expect(normConfig).toEqual(
      defaultsDeep(
        {
          start: redHighlight.start,
          end: {
            fillMode: 'light',
            class: `class-1 class-2 ${defHighlight.end.class}`,
          },
        },
        defHighlight,
      ),
    );
  });
  // it('should normalize highlight w/ style', () => {
  //   const config = {
  //     backgroundColor: 'red',
  //     borderWidth: '1px',
  //   };
  //   const normConfig = theme.normalizeHighlight(config, themeConfig);
  //   expect(normConfig).toEqual({
  //     base: {
  //       color: 'blue',
  //       fillMode: 'light',
  //       style: { ...config },
  //     },
  //   });
  // });
});
