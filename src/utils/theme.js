import {
  isObject,
  isString,
  isArray,
  capitalize,
  kebabCase,
  get,
  set,
  hasAny,
  mapValues,
  defaults,
  toPairs,
} from './_';

const cssProps = ['bg', 'text'];
const colors = ['blue', 'red', 'orange'];
const colorSuffixes = [
  'L5',
  'L4',
  'L3',
  'L2',
  'L1',
  'D1',
  'D2',
  'D3',
  'D4',
  'D5',
];

const targetProps = ['base', 'start', 'end', 'startEnd'];
const displayProps = ['class', 'style', 'theme'];

export const defaultThemeConfig = {
  color: 'blue',
  highlight: {
    base: {
      theme: {
        fill: 'light',
      },
    },
  },
};

// Creates all the css classes needed for the theme
function mixinCssClasses(target) {
  cssProps.forEach(prop => {
    colors.forEach(color => {
      colorSuffixes.forEach(colorSuffix => {
        const key = `${prop}${capitalize(color)}${colorSuffix}`;
        target[key] = kebabCase(key);
      });
    });
  });
  return target;
}

function normArray(config) {
  if (isString(config)) {
    return [config];
  }
  if (isArray(config)) {
    return [...config];
  }
  return [];
}

function normObject(config) {
  if (isObject(config)) {
    return {
      ...config,
    };
  }
  return {};
}

function getDefDisplay({ type, initial, themeConfig }) {
  switch (type) {
    case 'class':
      return [...initial];
    case 'style':
      return { ...initial };
    case 'theme':
      return {
        ...initial,
        color: themeConfig.color,
      };
  }
}

function getDefTarget(type, themeConfig) {
  switch (type) {
    case 'base':
      return {
        theme: {
          ...getDefDisplay('theme', themeConfig),
          fill: 'light',
        },
      };
    case 'start':
    case 'end':
    case 'startEnd':
      return {
        theme: {
          ...getDefDisplay('theme', themeConfig),
          fill: 'solid',
        },
      };
  }
}

function getDefAttribute(type, themeConfig) {
  switch (type) {
    case 'highlight':
      return {
        base: getDefTarget('base', themeConfig),
      };
  }
}

function normalizeDisplay({ root, type, config, path, opts, themeConfig }) {
  let defVal = getDefDisplay({ type, initial: config, themeConfig });
  if (type === 'class' && isArray(config)) {
    set(root, path, defVal);
  } else if (type === 'style' && isObject(config)) {
    set(root, path, defVal);
  } else if (type === 'theme') {
    set(root, path, { ...defVal, ...opts.theme });
  }
}

function normalizeTarget({ root, type, config, path, opts, themeConfig }) {
  const defTarget = getDefTarget(type, themeConfig);
  if (config === true) {
    set(root, path, defTarget);
  } else if (isString(config)) {
    set(root, path, defTarget);
    set(opts, 'theme.color', config);
  } else if (isObject(config)) {
    if (hasAny(config, displayProps)) {
      set(root, path, { ...config });
    } else {
      set(root, `${path}.style`, { ...config });
    }
  }

  toPairs(get(root, path)).map(([displayType, displayConfig]) => {
    normalizeDisplay({
      root,
      type: displayType,
      config: displayConfig,
      path: `${path}.${displayType}`,
      opts: { ...opts },
      themeConfig,
    });
  });
}

function normalizeAttribute({ type, config, themeConfig }) {
  let root = {};
  const opts = { theme: { color: themeConfig.color } };
  const defAttribute = getDefAttribute(type, themeConfig);
  if (config === true) {
    root = defAttribute;
  } else if (isString(config)) {
    root = defAttribute;
    set(opts, 'theme.color', config);
  } else if (isObject(config)) {
    if (hasAny(config, targetProps)) {
      root = { ...config };
    } else if (hasAny(config, displayProps)) {
      set(root, 'base', { ...config });
    } else {
      set(root, 'base.style', { ...config });
    }
  }
  toPairs(root).map(([targetType, targetConfig]) => {
    normalizeTarget({
      root,
      type: targetType,
      config: targetConfig,
      path: targetType,
      opts: { ...opts },
      themeConfig,
    });
  });

  return root;
}

// Normalizes attribute config to the structure defined by the properties
function normalizeAttr(
  config,
  attrType,
  targetProps,
  displayProps,
  themeConfig,
) {
  let target = {};
  // Assign non-object configs to the base theme
  if (config === true) {
    target = themeConfig.highlight;
  } else if (!isObject(config)) {
    target.base = { theme: config };
    // Check if config is NOT in normalized structure
  } else if (!hasAny(config, targetProps)) {
    target.base = { ...config };
  } else {
    target = { ...config };
  }
  // Normalize attribute target sections
  target = mapValues(target, val => {
    let result = {};
    if (!isObject(val)) {
      result.theme = val;
    } else if (!hasAny(val, displayProps)) {
      // Assign properties to style for backwards compatibility
      result.style = { ...val };
    } else {
      result = { ...val };
    }
    // Normalize attribute display properties
    result.class = normArray(result.class);
    result.style = normObject(result.style);
    if (!isObject(result.theme)) {
      result.theme = {
        color: isString(result.theme) ? result.theme : themeConfig.color,
        fill: 'solid',
      };
      console.log(`${attrType}.${target}.theme.fill`);
    } else {
      defaults(result.theme, {
        color: themeConfig.color,
        fill: 'solid',
      });
    }
    return result;
  });
  return target;
}

export const normalizeHighlight = (
  config,
  themeConfig = defaultThemeConfig,
) => {
  // let highlight = normalizeAttr(
  //   config,
  //   'highlight',
  //   normHighlightProps,
  //   normAttrProps,
  //   themeConfig,
  // );
  let highlight = normalizeAttribute({
    config,
    type: 'highlight',
    themeConfig,
  });
  return highlight;
};

const getStartEndBackgroundLayer = ({ class: className, style, theme }) => {
  return {
    wrapperClass: '',
    class: 'vc-highlight',
  };
};

const createTheme = Vue => {
  const theme = {
    classes: mixinCssClasses({}),
    getHighlightBackgrounds({ key, targetDate, highlight }, themeConfig) {
      const backgrounds = [];
      if (!highlight) return backgrounds;

      highlight = normalizeHighlight(highlight);
      const { isDate, isComplex, startTime, endTime } = targetDate;

      if (isDate || isComplex) {
        backgrounds.push({});
      }
    },
  };
  Vue.prototype.$theme = theme;
};

export default createTheme;
