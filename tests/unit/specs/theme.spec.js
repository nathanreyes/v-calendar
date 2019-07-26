import Theme from '@/utils/theme';

const themeColor = 'blue';
const themeConfig = {
  color: themeColor,
  isDark: false,
  highlightBaseFillMode: 'light',
  highlightStartEndFillMode: 'solid',
  highlightStartEndClass: 'vc-rounded-full',
  bgAccentLow: {
    light: `vc-bg-${themeColor}-200`,
    dark: `vc-bg-${themeColor}-800 vc-opacity-75`,
  },
  bgAccentHigh: {
    light: `vc-bg-${themeColor}-600`,
    dark: `vc-bg-${themeColor}-500`,
  },
  contentAccent: {
    light: `vc-font-bold vc-text-${themeColor}-900`,
    dark: `vc-font-bold vc-text-${themeColor}-100`,
  },
  contentAccentContrast: 'vc-font-bold vc-text-white',
};

const theme = new Theme(themeConfig);

describe.only('Theme', () => {
  it('should normalize highlight w/ true', () => {
    const config = true;
    const normConfig = theme.normalizeHighlight(config, themeConfig);
    const { color, isDark } = themeConfig;
    expect(normConfig).toEqual({
      base: {
        color,
        isDark,
        fillMode: theme.highlightBaseFillMode,
        class: theme.bgAccentLow,
        contentClass: theme.contentAccent,
      },
      start: {
        color,
        isDark,
        fillMode: theme.highlightStartEndFillMode,
        class: `${theme.highlightStartEndClass} ${theme.bgAccentHigh}`,
        contentClass: theme.contentAccentContrast,
      },
      end: {
        color,
        isDark,
        fillMode: theme.highlightStartEndFillMode,
        class: `${theme.highlightStartEndClass} ${theme.bgAccentHigh}`,
        contentClass: theme.contentAccentContrast,
      },
    });
  });
  // it('should normalize highlight w/ false', () => {
  //   const config = false;
  //   const normConfig = theme.normalizeHighlight(config, themeConfig);
  //   expect(normConfig).toEqual(null);
  // });
  // it('should normalize highlight w/ theme color', () => {
  //   const config = 'red';
  //   const normConfig = theme.normalizeHighlight(config, themeConfig);
  //   expect(normConfig).toEqual({
  //     base: { color: 'red', fillMode: 'light' },
  //   });
  // });
  // it('should normalize highlight w/ target boolean', () => {
  //   const config = {
  //     base: true,
  //   };
  //   const normConfig = theme.normalizeHighlight(config, themeConfig);
  //   expect(normConfig).toEqual({
  //     base: { color: 'blue', fillMode: 'light' },
  //   });
  // });
  // it('should normalize highlight w/ target theme name', () => {
  //   const config = {
  //     base: 'red',
  //   };
  //   const normConfig = theme.normalizeHighlight(config, themeConfig);
  //   expect(normConfig).toEqual({
  //     base: { color: 'red', fillMode: 'light' },
  //   });
  // });
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
