import { POPOVER_VISIBILITIES } from './constants';
import { isObject, isFunction } from './_';

const defaults = {
  componentPrefix: 'v',
  firstDayOfWeek: 1,
  navVisibility: 'click',
  titlePosition: 'center',
  titleTransition: 'slide-h',
  weeksTransition: 'slide-h',
  paneWidth: 256, // px,
  showLinkedButtons: false,
  formats: {
    title: 'MMMM YYYY',
    weekdays: 'W',
    navMonths: 'MMM',
    input: ['L', 'YYYY-MM-DD', 'YYYY/MM/DD'],
    dayPopover: 'WWW, MMM D, YYYY',
    data: ['L', 'YYYY-MM-DD', 'YYYY/MM/DD'],
  },
  screens: {
    sm: '576px',
    md: '768px',
    lg: '992px',
    xl: '1200px',
  },
  datePickerInputProps: ({ dragValue, mode, format }) => ({
    ...(mode === 'single' && {
      style: {
        minWidth: '100px',
      },
      placeholder: format,
    }),
    ...(mode === 'multiple' && {
      style: {
        minWidth: '200px',
      },
      placeholder: `${format}, ...`,
    }),
    ...(mode === 'range' && {
      style: {
        minWidth: '150px',
        ...(dragValue && {
          color: 'rgba(0, 0, 0, 0.3)',
        }),
      },
      placeholder: `${format} - ${format}`,
    }),
  }),
  datePickerUpdateOnInput: true,
  datePickerInputDebounce: 1000,
  datePickerTintColor: '#33bfcc',
  datePickerShowCaps: false,
  datePickerShowDayPopover: true,
  datePickerDisabledAttribute: {
    contentStyle: ({ isHovered }) => ({
      color: '#d98c8c',
      fontWeight: 600,
      opacity: 0.6,
      borderRadius: '0',
      ...(isHovered && {
        cursor: 'not-allowed',
        backgroundColor: 'transparent',
      }),
    }),
  },
  popoverExpanded: false,
  popoverDirection: 'bottom',
  popoverAlign: 'left',
  popoverVisibility: POPOVER_VISIBILITIES.FOCUS,
  popoverContentOffset: 10, // px
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
    height: '1.8rem',
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
    wrapper: null,
    verticalDivider: null,
    horizontalDivider: null,
    pane: null,
    header: null,
    headerTitle: null,
    headerArrows: null,
    headerHorizontalDivider: null,
    navHeader: null,
    navHeaderTitle: null,
    navHeaderArrows: null,
    navMonthCell: null,
    navYearCell: null,
    weekdays: null,
    weekdaysHorizontalDivider: null,
    weeks: null,
    dayCell: null,
    dayContent: null,
    dayContentHover: null,
    dayPopoverContent: {
      color: '#333333',
      fontSize: '.8rem',
      whiteSpace: 'nowrap',
    },
    dots: null,
    bars: null,
  },
};

export default defaults;

export const resolveDefault = (def, args) =>
  (isObject(def) && def) || (isFunction(def) && def(args)) || def;

export const mergeDefaults = (...defaultArgs) =>
  Object.assign(defaults, ...defaultArgs);
