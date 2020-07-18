export default {
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
    light: 'vc-bg-{color}-200',
    dark: 'vc-bg-{color}-800 vc-opacity-75',
  },
  bgAccentHigh: {
    light: 'vc-bg-{color}-600',
    dark: 'vc-bg-{color}-500',
  },
  contentAccent: {
    light: 'vc-font-bold vc-text-{color}-900',
    dark: 'vc-font-bold vc-text-{color}-100',
  },
  contentAccentContrast: 'vc-font-bold vc-text-white',
};
