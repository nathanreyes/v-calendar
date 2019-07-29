import Theme from '@/utils/theme';

const defThemeConfig = {
  color: 'blue',
  isDark: false,
  highlightBaseFillMode: 'light',
  highlightStartEndFillMode: 'solid',
  highlightStartEndClass: 'vc-rounded-full',
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
      class: theme.bgAccentLow,
      contentClass: theme.contentAccent,
    },
    start: {
      color: theme.color,
      isDark: theme.isDark,
      fillMode: theme.highlightStartEndFillMode,
      class: `${theme.highlightStartEndClass} ${theme.bgAccentHigh}`,
      contentClass: theme.contentAccentContrast,
    },
    end: {
      color: theme.color,
      isDark: theme.isDark,
      fillMode: theme.highlightStartEndFillMode,
      class: `${theme.highlightStartEndClass} ${theme.bgAccentHigh}`,
      contentClass: theme.contentAccentContrast,
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
  // it('should normalize highlight w/ style-like properties', () => {
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
  // it('should normalize highlight w/ class and style', () => {
  //   const config = {
  //     class: 'style-1 style-2',
  //     style: {
  //       borderWidth: '1px',
  //     },
  //   };
  //   const normConfig = theme.normalizeHighlight(config, themeConfig);
  //   expect(normConfig).toEqual({
  //     base: {
  //       ...config,
  //       color: 'blue',
  //       fillMode: 'light',
  //     },
  //   });
  // });
  // it('should normalize highlight w/ mixed target configurations', () => {
  //   const config = {
  //     base: true,
  //     start: 'red',
  //     end: {
  //       class: 'style-1 style-2',
  //       style: {
  //         borderWidth: '1px',
  //       },
  //       fillMode: 'light',
  //     },
  //   };
  //   const normConfig = theme.normalizeHighlight(config);
  //   expect(normConfig).toEqual({
  //     base: { color: 'blue', fillMode: 'light' },
  //     start: { color: 'red' },
  //     end: {
  //       ...config.end,
  //       color: 'blue',
  //       fillMode: 'light',
  //     },
  //   });
  // });
});
