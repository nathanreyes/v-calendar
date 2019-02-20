import { normalizeHighlight } from '@/utils/theme';

const themeConfig = {
  color: 'blue',
  highlight: {
    base: {
      fillMode: 'light',
    },
  },
};

describe.only('Theme', () => {
  it('should normalize highlight w/ true', () => {
    let config = true;
    let normConfig = normalizeHighlight(config, themeConfig);
    expect(normConfig).toEqual({
      base: {
        fillMode: 'light',
        color: 'blue',
      },
    });
  });

  it('should normalize highlight w/ false', () => {
    let config = false;
    let normConfig = normalizeHighlight(config, themeConfig);
    expect(normConfig).toEqual(null);
  });

  it('should normalize highlight w/ theme color', () => {
    const config = 'red';
    const normConfig = normalizeHighlight(config, themeConfig);
    expect(normConfig).toEqual({
      base: { color: 'red', fillMode: 'light' },
    });
  });

  it('should normalize highlight w/ target boolean', () => {
    const config = {
      base: true,
    };
    const normConfig = normalizeHighlight(config, themeConfig);
    expect(normConfig).toEqual({
      base: { color: 'blue', fillMode: 'light' },
    });
  });

  it('should normalize highlight w/ target theme name', () => {
    const config = {
      base: 'red',
    };
    const normConfig = normalizeHighlight(config, themeConfig);
    expect(normConfig).toEqual({
      base: { color: 'red', fillMode: 'light' },
    });
  });

  it('should normalize highlight w/ style-like properties', () => {
    const config = {
      backgroundColor: 'red',
      borderWidth: '1px',
    };
    const normConfig = normalizeHighlight(config, themeConfig);
    expect(normConfig).toEqual({
      base: {
        color: 'blue',
        fillMode: 'light',
        style: { ...config },
      },
    });
  });

  it('should normalize highlight w/ class and style', () => {
    const config = {
      class: 'style-1 style-2',
      style: {
        borderWidth: '1px',
      },
    };
    const normConfig = normalizeHighlight(config, themeConfig);
    expect(normConfig).toEqual({
      base: {
        ...config,
        color: 'blue',
        fillMode: 'light',
      },
    });
  });

  it('should normalize highlight w/ mixed target configurations', () => {
    const config = {
      base: true,
      start: 'red',
      end: {
        class: 'style-1 style-2',
        style: {
          borderWidth: '1px',
        },
        fillMode: 'light',
      },
    };
    const normConfig = normalizeHighlight(config);
    expect(normConfig).toEqual({
      base: { color: 'blue', fillMode: 'light' },
      start: { color: 'red' },
      end: {
        ...config.end,
        color: 'blue',
        fillMode: 'light',
      },
    });
  });
});
