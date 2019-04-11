import { POPOVER_VISIBILITIES } from '../constants';
import touch from './touch.json';
import masks from './masks.json';
import screens from './screens.json';
import theme from './theme';
import locales from './locales';

export default {
  componentPrefix: 'v',
  navVisibility: 'click',
  titlePosition: 'center',
  transition: 'slide-h',
  touch,
  masks,
  screens,
  theme,
  locales,
  datePicker: {
    updateOnInput: true,
    inputDebounce: 1000,
    popover: {
      visibility: POPOVER_VISIBILITIES.FOCUS,
      placement: 'bottom-start',
      keepVisibleOnInput: false,
    },
  },
};
