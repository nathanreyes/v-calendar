import locales from './locales';
import { POPOVER_VISIBILITIES } from './constants';
import { blendColors } from './helpers';

const popoverLabel = (attr) => {
  if (!attr.targetDate.isRange) return '';
  const diff = attr.targetDate.daySpan;
  return `${diff + 1} Day${diff === 0 ? '' : 's'}, ${diff} Night${diff === 1 ? '' : 's'}`;
};

const defaults = {
  themeStyles: {
    wrapper: { backgroundColor: '#fafafa', border: '1px solid #dadada' },
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
    dayCellNotInMonth: { opacity: 0.4 },
    // dayContent: null,
    // dayContentHover: null,
    // dots: null,
    // bars: null,
    dayPopoverContent: {
      color: '#333333',
      fontSize: '.8rem',
      whiteSpace: 'nowrap',
    },
  },
  firstDayOfWeek: 1,
  navVisibility: 'focus',
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
    popover: {
      label: popoverLabel,
      hideIndicator: true,
    },
  }),
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
    popover: {
      label: popoverLabel,
      hideIndicator: true,
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
    borderWidth: '0',
    borderStyle: 'solid',
    borderRadius: '1.8rem',
    opacity: 1,
  },
  dot: {
    diameter: '5px',
    backgroundColor: '#66b3cc',
    borderWidth: '0',
    borderStyle: 'solid',
    borderRadius: '50%',
    opacity: 1,
  },
  bar: {
    height: '3px',
    backgroundColor: '#66b3cc',
    borderWidth: '0',
    borderStyle: 'solid',
    opacity: 1,
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
