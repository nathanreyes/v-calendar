export default {
  color: 'blue',
  isDark: false,
  container: {
    light:
      'vc-border vc-border-gray-400 vc-rounded-lg vc-text-gray-900 vc-bg-white',
    dark:
      'vc-border vc-border-gray-900 vc-rounded-lg vc-text-gray-200 vc-bg-gray-900 vc-shadow',
  },
  header: {
    light: 'vc-text-gray-900',
    dark: 'vc-text-gray-200',
  },
  title: {
    light: 'vc-text-lg vc-text-gray-800 vc-font-semibold hover:vc-opacity-75',
    dark: 'vc-text-lg vc-text-gray-100 vc-font-semibold hover:vc-opacity-75',
  },
  arrows: {
    light: 'vc-text-gray-600 hover:vc-opacity-50',
    dark: 'vc-text-white hover:vc-opacity-50',
  },
  weekdays: {
    light: 'vc-text-sm vc-font-bold vc-text-gray-500',
    dark: 'vc-text-sm vc-font-bold vc-text-{color}-200',
  },
  navPopoverContainer: {
    light:
      'vc-rounded-lg vc-text-sm vc-font-semibold vc-text-white vc-bg-gray-800 vc-border vc-border-gray-700 vc-py-1 vc-shadow',
    dark:
      'vc-rounded-lg vc-text-sm vc-font-semibold vc-text-gray-800 vc-bg-white vc-border vc-border-gray-100 vc-py-1 vc-shadow',
  },
  navTitle: {
    light:
      'vc-text-{color}-100 vc-font-bold hover:vc-bg-gray-900 vc-px-2 vc-py-1 vc-rounded',
    dark:
      'vc-text-gray-900 vc-font-bold hover:vc-bg-gray-200 vc-px-2 vc-py-1 vc-rounded',
  },
  navArrows: {
    light: 'hover:vc-bg-gray-900 vc-rounded',
    dark: 'hover:vc-bg-gray-200 vc-rounded',
  },
  navCell: 'vc-w-12 vc-text-center vc-py-1 vc-mx-1 vc-rounded',
  navCellInactive: {
    light:
      'hover:vc-bg-gray-900 hover:vc-shadow-inner vc-border-2 vc-border-transparent',
    dark: 'hover:vc-bg-gray-200 vc-border-2 vc-border-transparent',
  },
  navCellInactiveCurrent: {
    light:
      'vc-text-{color}-100 vc-font-bold hover:vc-bg-gray-900 vc-border-2 vc-border-{color}-100',
    dark:
      'vc-text-{color}-600 vc-font-bold hover:vc-bg-gray-200 vc-border-2 vc-border-{color}-500',
  },
  navCellActive: {
    light: 'vc-bg-{color}-100 vc-text-{color}-900 vc-font-bold vc-shadow',
    dark: 'vc-bg-{color}-500 vc-text-white vc-font-bold vc-shadow',
  },
  navCellDisabled: 'vc-opacity-25',
  dayNotInMonth: 'vc-opacity-0 vc-pointer-events-none',
  dayContent: {
    light:
      'vc-font-medium vc-text-sm vc-cursor-pointer focus:vc-font-bold vc-rounded-full',
    dark:
      'vc-font-medium vc-text-sm vc-cursor-pointer focus:vc-font-bold vc-rounded-full',
  },
  dayContentDisabled: {
    light: 'vc-text-sm vc-text-gray-400 vc-font-medium vc-pointer-events-none',
    dark: 'vc-text-sm vc-text-gray-600 vc-font-medium vc-pointer-events-none',
  },
  dayPopoverContainer: {
    light:
      'vc-rounded vc-text-xs vc-text-white vc-font-medium vc-bg-gray-800 vc-border vc-border-gray-700 vc-px-2 vc-py-1 vc-shadow',
    dark:
      'vc-rounded vc-text-xs vc-text-gray-900 vc-font-medium vc-bg-white vc-border vc-border-gray-200 vc-px-2 vc-py-1 vc-shadow',
  },
  dayPopoverHeader: {
    light: 'vc-text-xs vc-text-gray-300 vc-font-semibold',
    dark: 'vc-text-xs vc-text-gray-700 vc-font-semibold',
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
  contentAccentContrast: {
    light: 'vc-font-bold vc-text-white',
    dark: 'vc-font-bold vc-text-white',
  },
  datePickerInput:
    'vc-shadow vc-appearance-none vc-border vc-rounded vc-w-full vc-py-2 vc-px-3 vc-text-gray-800 vc-bg-white vc-leading-tight focus:vc-outline-none focus:vc-shadow-outline',
  datePickerInputDrag:
    'vc-shadow vc-appearance-none vc-border vc-rounded vc-w-full vc-py-2 vc-px-3 vc-text-gray-400 vc-bg-white vc-leading-tight focus:vc-outline-none focus:vc-shadow-outline',
};
