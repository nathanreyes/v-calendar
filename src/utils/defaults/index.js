import { POPOVER_VISIBILITIES } from '../constants';
import formats from './formats.json';
import screens from './screens.json';
import theme from './theme.json';
import locales from './locales';

export default {
  componentPrefix: 'v',
  navVisibility: 'click',
  titlePosition: 'center',
  transition: 'slide-h',
  maxSwipeTime: 300, // ms
  minHorizontalSwipeDistance: 60, // px
  maxVerticalSwipeDistance: 80, // px
  maxTapTolerance: 0, // ms
  maxTapDuration: 200, // ms
  formats,
  screens,
  theme,
  locales,
  datePicker: {
    updateOnInput: true,
    inputDebounce: 1000,
    popover: {
      placement: 'bottom',
      visibility: POPOVER_VISIBILITIES.FOCUS,
      keepVisibleOnInput: false,
    },
  },
};
