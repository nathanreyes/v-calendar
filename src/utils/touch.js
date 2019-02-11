import { on, off } from '@/utils/helpers';
import { isFunction } from './_';

export const addTapOrClickHandler = (element, handler) => {
  if (!element || !element.addEventListener || !isFunction(handler)) {
    return null;
  }
  let tap = false;
  const touchstart = () => (tap = true);
  const touchmove = () => (tap = false);
  const touchend = () => {
    if (event.type === 'click') tap = true;
    if (tap) {
      handler(event);
    }
  };
  on(element, 'touchstart', touchstart);
  on(element, 'touchmove', touchmove);
  on(element, 'click', touchend);
  on(element, 'touchend', touchend);
  return () => {
    off(element, 'touchstart', touchstart);
    off(element, 'touchmove', touchmove);
    off(element, 'click', touchend);
    off(element, 'touchend', touchend);
  };
};
