import { normalizeHighlight } from '@/utils/theme';

const themeConfig = {
  color: 'blue',
};

describe.only('Theme', () => {
  // it('should normalize highlight w/ true', () => {
  //   let config = true;
  //   let normConfig = normalizeHighlight(config, themeConfig);
  //   expect(normConfig).toEqual({
  //     base: { theme: { color: 'blue', fill: 'light' } },
  //   });
  //   config = false;
  //   normConfig = normalizeHighlight(config);
  //   expect(normConfig).toEqual({});
  // });

  // it('should normalize highlight w/ false', () => {
  //   let config = false;
  //   let normConfig = normalizeHighlight(config, themeConfig);
  //   expect(normConfig).toEqual({});
  // });

  // it('should normalize highlight w/ theme color', () => {
  //   const config = 'blue';
  //   const normConfig = normalizeHighlight(config, themeConfig);
  //   expect(normConfig).toEqual({
  //     base: { theme: { color: 'blue', fill: 'light' } },
  //   });
  // });

  // it('should normalize highlight w/ target boolean', () => {
  //   const config = {
  //     base: true,
  //   };
  //   const normConfig = normalizeHighlight(config, themeConfig);
  //   expect(normConfig).toEqual({
  //     base: { theme: { color: 'blue', fill: 'light' } },
  //   });
  // });

  // it('should normalize highlight w/ target theme name', () => {
  //   const config = {
  //     base: 'red',
  //   };
  //   const normConfig = normalizeHighlight(config, themeConfig);
  //   expect(normConfig).toEqual({
  //     base: { theme: { color: 'red', fill: 'light' } },
  //   });
  // });

  // it('should normalize highlight w/ style-like properties', () => {
  //   const config = {
  //     backgroundColor: 'red',
  //     borderWidth: '1px',
  //   };
  //   const normConfig = normalizeHighlight(config, themeConfig);
  //   expect(normConfig).toEqual({
  //     base: {
  //       style: { ...config },
  //     },
  //   });
  // });

  it('should normalize highlight w/ class and style', () => {
    const config = {
      class: 'style-1 style-2',
      style: {
        borderWidth: '1px',
      },
      theme: true,
    };
    const normConfig = normalizeHighlight(config, themeConfig);
    expect(normConfig).toEqual({
      base: {
        ...config,
        theme: {
          color: 'blue',
          fill: 'light',
        },
      },
    });
  });

  // it('should normalize highlight w/ mixed target configurations', () => {
  //   const config = {
  //     base: true,
  //     start: 'red',
  //     end: {
  //       class: 'style-1 style-2',
  //       style: {
  //         borderWidth: '1px',
  //       },
  //       theme: true,
  //     },
  //   };
  //   const normConfig = normalizeHighlight(config);
  //   expect(normConfig).toEqual({
  //     base: { theme: { color: 'blue', fill: 'light' } },
  //     start: { theme: { color: 'red', fill: 'light' } },
  //     end: {
  //       ...config.end,
  //       theme: {
  //         color: 'blue',
  //         fill: 'light',
  //       },
  //     },
  //   });
  // });
});
