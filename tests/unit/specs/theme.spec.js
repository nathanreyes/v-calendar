import Theme from '../../../src/utils/theme';

function getHighlightResult(
  fillMode,
  color,
  isDark,
  bgClass = '',
  contentClass = '',
) {
  let styles = {};
  let classes = {};
  if (bgClass) {
    classes.class = bgClass;
  }
  if (contentClass) {
    classes.contentClass = contentClass;
  }
  switch (fillMode) {
    case 'none': {
      styles = {
        style: {
          backgroundColor: isDark ? 'var(--gray-900)' : 'var(--white)',
          border: '2px solid',
          borderColor: isDark ? `var(--${color}-200)` : `var(--${color}-700)`,
          borderRadius: 'var(--rounded-full)',
        },
        contentStyle: {
          color: isDark ? `var(--${color}-100)` : `var(--${color}-900)`,
          fontWeight: 'var(--font-bold)',
        },
      };
      break;
    }
    case 'light': {
      styles = {
        style: {
          backgroundColor: isDark
            ? `var(--${color}-800)`
            : `var(--${color}-200)`,
          opacity: isDark ? 0.75 : 1,
          borderRadius: 'var(--rounded-full)',
        },
        contentStyle: {
          color: isDark ? `var(--${color}-100)` : `var(--${color}-900)`,
          fontWeight: 'var(--font-bold)',
        },
      };
      break;
    }
    case 'solid': {
      styles = {
        style: {
          backgroundColor: isDark
            ? `var(--${color}-500)`
            : `var(--${color}-600)`,
          borderRadius: 'var(--rounded-full)',
        },
        contentStyle: {
          color: 'var(--white)',
          fontWeight: 'var(--font-bold)',
        },
      };
      break;
    }
  }
  return {
    fillMode,
    color,
    isDark,
    ...styles,
  };
}

describe('Theme', () => {
  const lightTheme = new Theme({ color: 'blue', isDark: false });
  const darkTheme = new Theme({ color: 'red', isDark: true });

  const themes = [lightTheme, darkTheme];
  themes.forEach(theme => {
    // Check highlight with `true`
    it('should create highlight with `true`', () => {
      const highlight = theme.normalizeHighlight(true);
      const targets = {
        base: 'light',
        start: 'solid',
        end: 'solid',
      };
      Object.entries(targets).forEach(([t, fillMode]) => {
        expect(highlight[t]).toEqual(
          getHighlightResult(fillMode, theme.color, theme.isDark),
        );
      });
    });
    // Check highlights with fill modes
    const fillModes = ['none', 'light', 'solid'];
    fillModes.forEach(fillMode => {
      it('should create highlight with fillMode = ' + fillMode, () => {
        const highlight = theme.normalizeHighlight({ fillMode });
        ['base', 'start', 'end'].forEach(t => {
          expect(highlight[t]).toEqual(
            getHighlightResult(fillMode, theme.color, theme.isDark),
          );
        });
      });
    });
    // Check highlights with class
    it('should create highlight with `class`', () => {
      const config = {
        class: 'highlight_class',
      };
      const highlight = theme.normalizeHighlight(config);
      ['base', 'start', 'end'].forEach(t => {
        expect(highlight[t].class).toEqual(config.class);
      });
    });
    // Check highlights with content class
    it('should create highlight with `contentClass`', () => {
      const config = {
        contentClass: 'highlight_content_class',
      };
      const highlight = theme.normalizeHighlight(config);
      ['base', 'start', 'end'].forEach(t => {
        expect(highlight[t].contentClass).toEqual(config.contentClass);
      });
    });
    // Check highlights with `style`
    it('should create highlight with `style`', () => {
      const config = {
        style: {
          backgroundColor: '#fafafa',
          opacity: 1,
          pointerEvents: 'none',
        },
      };
      const highlight = theme.normalizeHighlight(config);
      ['base', 'start', 'end'].forEach(t => {
        Object.entries(config.style).forEach(([p, v]) => {
          expect(highlight[t].style[p]).toEqual(v);
        });
      });
    });
    // Check highlights with `contentStyle`
    it('should create highlight with `contentStyle`', () => {
      const config = {
        contentStyle: {
          color: '#fafafa',
          opacity: 0.5,
        },
      };
      const highlight = theme.normalizeHighlight(config);
      ['base', 'start', 'end'].forEach(t => {
        Object.entries(config.contentStyle).forEach(([p, v]) => {
          expect(highlight[t].contentStyle[p]).toEqual(v);
        });
      });
    });
    // Check highlights with classes and styles
    it('should create highlight with classes and styles', () => {
      const config = {
        class: 'highlight_class',
        contentClass: 'highlight_content_class',
        style: {
          backgroundColor: '#fafafa',
          opacity: 1,
          pointerEvents: 'none',
        },
        contentStyle: {
          color: '#fafafa',
          opacity: 0.5,
        },
      };
      const highlight = theme.normalizeHighlight(config);
      ['base', 'start', 'end'].forEach(t => {
        expect(highlight[t].class).toEqual(config.class);
        expect(highlight[t].contentClass).toEqual(config.contentClass);
        Object.entries(config.style).forEach(([p, v]) => {
          expect(highlight[t].style[p]).toEqual(v);
        });
        Object.entries(config.contentStyle).forEach(([p, v]) => {
          expect(highlight[t].contentStyle[p]).toEqual(v);
        });
      });
    });
  });
});
