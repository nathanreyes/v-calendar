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
  arrows: {
    light:
      'vc-text-gray-600 vc-rounded vc-border-2 vc-border-transparent hover:vc-opacity-50 hover:vc-bg-gray-300 focus:vc-border-gray-300',
    dark:
      'vc-text-white vc-rounded vc-border-2 vc-border-transparent hover:vc-opacity-50 focus:vc-border-gray-700',
  },
  weekdays: {
    light: 'vc-text-sm vc-font-bold vc-text-gray-500',
    dark: 'vc-text-sm vc-font-bold vc-text-{color}-200',
  },
  navPopoverContainer: {
    light:
      'vc-w-40 vc-rounded-lg vc-text-sm vc-font-semibold vc-text-white vc-bg-gray-800 vc-border vc-border-gray-700 vc-p-1 vc-shadow',
    dark:
      'vc-w-40 vc-rounded-lg vc-text-sm vc-font-semibold vc-text-gray-800 vc-bg-white vc-border vc-border-gray-100 vc-p-1 vc-shadow',
  },
  navTitle: {
    light:
      'vc-text-{color}-100 vc-font-bold vc-leading-snug vc-px-2 vc-py-1 vc-rounded vc-border-2 vc-border-transparent hover:vc-bg-gray-900 focus:vc-border-{color}-600',
    dark:
      'vc-text-gray-900 vc-font-bold vc-leading-snug vc-px-2 vc-py-1 vc-rounded vc-border-2 vc-border-transparent hover:vc-bg-gray-200 focus:vc-border-{color}-400',
  },
  navCell: {
    light:
      'vc-w-full vc-font-semibold vc-cursor-pointer vc-text-center vc-leading-none vc-py-1 vc-px-1 vc-mx-1 vc-mb-1 vc-rounded vc-border-2 vc-border-transparent focus:vc-border-{color}-600',
    dark:
      'vc-w-full vc-font-semibold vc-cursor-pointer vc-text-center vc-leading-none vc-py-1 vc-px-1 vc-mx-1 vc-mb-1 vc-rounded vc-border-2 vc-border-transparent focus:vc-border-{color}-400',
  },
  navCellInactive: {
    light:
      'vc-text-white hover:vc-bg-gray-900 hover:vc-shadow-inner hover:vc-text-white',
    dark: 'vc-text-gray-800 hover:vc-bg-gray-200',
  },
  navCellActive: {
    light: 'vc-bg-{color}-100 vc-text-{color}-900 vc-font-bold vc-shadow',
    dark: 'vc-bg-{color}-500 vc-text-white vc-font-bold vc-shadow',
  },
  navFooter: {
    light: 'vc-flex vc-bg-gray-800 vc-rounded vc-overflow-hidden vc-mt-1',
    dark: 'vc-flex vc-bg-gray-200 vc-rounded vc-overflow-hidden vc-mt-1',
  },
  navShortcuts: {
    light:
      'vc-flex vc-justify-center vc-items-center vc-h-8 vc-px-2 vc-py-1 vc-text-white vc-bg-gray-700 hover:vc-bg-gray-900 vc-border vc-border-transparent focus:vc-border-{color}-600 vc-rounded-l vc-shadow-inner',
    dark:
      'vc-flex vc-justify-center vc-items-center vc-h-8 vc-px-2 vc-py-1 vc-text-gray-800 vc-bg-gray-300 hover:vc-bg-gray-400 vc-border vc-border-transparent focus:vc-border-{color}-400 vc-rounded-l vc-shadow-inner',
  },
  navSubmit: {
    light:
      'vc-flex vc-justify-center vc-items-center vc-h-8 vc-px-2 vc-text-{color}-900 vc-bg-{color}-100 hover:vc-bg-{color}-200 vc-border vc-border-transparent focus:vc-border-{color}-600 vc-rounded-r vc-shadow-inner',
    dark:
      'vc-flex vc-justify-center vc-items-center vc-h-8 vc-px-2 vc-text-white vc-bg-{color}-500 hover:vc-bg-{color}-600 vc-border vc-border-transparent focus:vc-border-{color}-700 vc-rounded-r vc-shadow-inner',
  },
  dayNotInMonth: 'vc-opacity-0 vc-pointer-events-none',
  dayContent:
    'vc-font-medium vc-text-sm vc-cursor-pointer focus:vc-font-bold vc-rounded-full',
  dayContentDisabled: {
    light: 'vc-text-gray-400',
    dark: 'vc-text-gray-600',
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
  contentAccentContrast: 'vc-font-bold vc-text-white',
  datePickerInput:
    'vc-appearance-none vc-text-base vc-text-gray-800 vc-bg-white vc-border vc-border-gray-400 vc-rounded vc-w-full vc-py-2 vc-px-3 vc-leading-tight focus:vc-outline-none focus:vc-shadow',
  datePickerInputDrag:
    'vc-appearance-none vc-text-base vc-text-gray-500 vc-bg-white vc-border vc-border-gray-400 vc-rounded vc-w-full vc-py-2 vc-px-3 vc-leading-tight focus:vc-outline-none focus:vc-shadow',
};
