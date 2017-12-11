import locales from './locales';
import { POPOVER_VISIBILITIES } from './constants';
import { blendColors } from './helpers';

const defaults = {
  themeStyles: {
    // wrapper: null,
    verticalDivider: { borderLeft: '1px solid #dadada' },
    // header: null,
    // headerTitle: null,
    // headerArrows: null,
    // headerVerticalDivider: null,
    // headerHorizontalDivider: null,
    // weekdays: null,
    // weekdaysVerticalDivider: null,
    // weekdaysHorizontalDivider: null,
    // weeks: null,
    // weeksVerticalDivider: null,
    // dayCell: null,
    // dayCellNotInMonth: null,
    // dayContent: null,
    // dayContentHover: null,
    // dots: null,
    // bars: null,
  },
  firstDayOfWeek: 1,
  titlePosition: 'center',
  titleTransition: 'slide-h',
  weeksTransition: 'slide-h',
  dateFormatter: d => d.toLocaleDateString(),
  dateParser: s => new Date(Date.parse(s)),
  datePickerInputClass: '',
  datePickerInputStyle: null,
  datePickerInputPlaceholder: '',
  datePickerSelectColor: '#66b3cc',
  datePickerDragColor: '#9fcfdf',
  datePickerSelectAttribute: color => ({
    key: 'drag-select',
    highlight: {
      backgroundColor: color,
      borderWidth: '1px',
      borderColor: blendColors(color, '#000000', 0.1),
    },
    contentStyle: {
      color: '#fafafa',
    },
    contentHoverStyle: {
      backgroundColor: 'transparent',
      border: '0',
    },
  }),
  datePickerDragAttribute: color => ({
    key: 'drag-select',
    highlight: {
      backgroundColor: color,
      height: '25px',
    },
    contentHoverStyle: {
      backgroundColor: 'transparent',
      border: '0',
    },
  }),
  datePickerDisabledAttribute: {
    key: 'disabled',
    order: 100,
    contentStyle: {
      color: '#bcbcbc',
      textDecoration: 'line-through',
    },
    contentHoverStyle: {
      cursor: 'not-allowed',
      backgroundColor: 'transparent',
    },
  },
  popoverExpanded: false,
  popoverDirection: 'bottom',
  popoverAlign: 'left',
  popoverVisibility: POPOVER_VISIBILITIES.HOVER,
  popoverVisibleDelay: 200,
  popoverHiddenDelay: 300,
  popoverContentOffset: '10px',
  maxSwipeTimeMs: 300,
  minHorizontalSwipeDistance: 60,
  maxVerticalSwipeDistance: 80,
  maxTapTolerance: 0, // ms
  maxTapDuration: 200, // ms
  highlight: {
    animated: true,
    height: '1.8rem',
    backgroundColor: '#65999a',
    borderWidth: '0',
    borderStyle: 'solid',
    borderRadius: '1.8rem',
  },
  dot: {
    diameter: '5px',
    backgroundColor: '#65999a',
    borderWidth: '0',
    borderStyle: 'solid',
    borderRadius: '50%',
  },
  bar: {
    height: '3px',
    backgroundColor: '#65999a',
    borderWidth: '0',
    borderStyle: 'solid',
  },
};

export default defaults;

export const mergeDefaults = (otherDefaults) => {
  // Get the locale supplied by the user
  let locale;
  // Get the user supplied locale
  if (otherDefaults && otherDefaults.locale) locale = locales[otherDefaults.locale.substring(0, 2)];
  // Get the detected browser locale if needed
  if (!locale) locale = locales[(window.navigator.userLanguage || window.navigator.language).substring(0, 2)];
  // Fall back to english locale if needed
  if (!locale) locale = locales.en;
  // Assign the language defaults
  const languageDefaults = {
    monthLabels: locale.months,
    monthNavLabels: locale.monthsShort,
    weekdayLabels: locale.weekdaysMin,
  };
  // Assign the defaults
  Object.assign(defaults, languageDefaults, otherDefaults);
};
