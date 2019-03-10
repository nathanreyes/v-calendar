import { POPOVER_VISIBILITIES } from '../constants';
import formats from './formats.json';
import screens from './screens.json';
import theme from './theme.json';
import locales from './locales';

const defaults = {
  componentPrefix: 'v',
  firstDayOfWeek: 1,
  navVisibility: 'click',
  titlePosition: 'center',
  transition: 'slide-h',
  formats,
  screens,
  theme,
  locales,
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
};

export default defaults;
