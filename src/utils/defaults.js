import locales from './locales';
import { POPOVER_VISIBILITIES } from './constants';
import { isObject, isFunction } from './typeCheckers';

const defaults = {
  componentPrefix: 'v',
  firstDayOfWeek: 1,
  navVisibility: 'focus',
  titlePosition: 'center',
  titleTransition: 'slide-h',
  weeksTransition: 'slide-h',
  paneWidth: 256, // px
  dateFormatter: d => d.toLocaleDateString(),
  dateParser: s => new Date(Date.parse(s)),
  datePickerInputProps: ({ dragValue, mode }) => ({
    ...(mode === 'single' && {
      style: {
        minWidth: '100px',
      },
      placeholder: 'Enter Date',
    }),
    ...(mode === 'multiple' && {
      style: {
        minWidth: '200px',
      },
      placeholder: 'Date 1, Date 2, ...',
    }),
    ...(mode === 'range' && {
      style: {
        minWidth: '150px',
        ...(dragValue && {
          color: 'rgba(0, 0, 0, 0.3)',
        }),
      },
      placeholder: 'Start Date - End Date',
    }),
  }),
  datePickerTintColor: '#66B3CC',
  datePickerShowCaps: false,
  datePickerShowPopover: true,
  datePickerDisabledAttribute: {
    contentStyle: {
      color: '#d98c8c',
      fontWeight: 600,
      opacity: 0.6,
      borderRadius: '0',
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
  popoverContentOffset: '10px',
  popoverKeepVisibleOnInput: false,
  maxSwipeTime: 300, // ms
  minHorizontalSwipeDistance: 60, // px
  maxVerticalSwipeDistance: 80, // px
  maxTapTolerance: 0, // ms
  maxTapDuration: 200, // ms
  highlight: {
    animated: true,
    height: '1.8rem',
    borderWidth: '0',
    borderStyle: 'solid',
    opacity: 1,
  },
  highlightCaps: {
    animated: true,
    height: '1.9rem',
    borderWidth: '0',
    borderStyle: 'solid',
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
  themeStyles: {
    wrapper: { backgroundColor: '#fafafa', border: '1px solid #dadada' },
    verticalDivider: { borderLeft: '1px solid #dadada' },
    pane: null,
    header: null,
    headerTitle: null,
    headerArrows: null,
    headerVerticalDivider: null,
    headerHorizontalDivider: null,
    weekdays: null,
    weekdaysVerticalDivider: null,
    weekdaysHorizontalDivider: null,
    weeks: null,
    weeksVerticalDivider: null,
    dayCell: null,
    dayCellNotInMonth: { opacity: 0.4 },
    dayContent: null,
    dayContentHover: null,
    dots: null,
    bars: null,
    dayPopoverContent: {
      color: '#333333',
      fontSize: '.8rem',
      whiteSpace: 'nowrap',
    },
  },
};

export default defaults;

export const resolveDefault = (def, args) => (isObject(def) && def) || (isFunction(def) && def(args)) || def;

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
    shortMonthLabels: locale.monthsShort,
    monthNavLabels: locale.monthsShort,
    weekdayLabels: locale.weekdaysMin,
  };
  // Assign the defaults
  Object.assign(defaults, languageDefaults, otherDefaults);
};
