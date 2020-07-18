export default {
  color: 'blue',
  isDark: false,
  container: {
    light:
      'vc-text-gray-900 vc-bg-white vc-border vc-border-gray-400 vc-rounded-lg',
    dark:
      'vc-text-gray-200 vc-bg-gray-900 vc-border vc-border-gray-700 vc-rounded-lg',
  },
  header: {
    light: 'vc-text-gray-900',
    dark: 'vc-text-gray-200',
  },
  title: {
    light: 'vc-text-lg vc-text-gray-800 vc-font-semibold hover:vc-opacity-75',
    dark: 'vc-text-lg vc-text-gray-100 vc-font-semibold hover:vc-opacity-75',
  },
  weekdays: {
    light: 'vc-text-sm vc-font-bold vc-text-gray-500',
    dark: 'vc-text-sm vc-font-bold vc-text-{color}-200',
  },
  navPopoverContainer: {
    light:
      'vc-rounded-lg vc-text-sm vc-font-semibold vc-text-white vc-bg-gray-800 vc-border vc-border-gray-700 vc-p-1 vc-shadow',
    dark:
      'vc-rounded-lg vc-text-sm vc-font-semibold vc-text-gray-800 vc-bg-white vc-border vc-border-gray-100 vc-p-1 vc-shadow',
  },
  dayNotInMonth: 'vc-opacity-0 vc-pointer-events-none',
  dayContent:
    'vc-font-medium vc-text-sm vc-cursor-pointer focus:vc-font-bold vc-rounded-full',
  dayContentDisabled: {
    light: 'vc-text-gray-400',
    dark: 'vc-text-gray-600',
  },
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
