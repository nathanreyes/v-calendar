import { on, off } from './helpers';
import { isFunction } from './_';

// This function detects taps or clicks
// Can't just rely on 'click' event because of oddities in mobile Safari
export const addTapOrClickHandler = (element, handler) => {
  if (!element || !element.addEventListener || !isFunction(handler)) {
    return null;
  }
  // State variables
  let tap = false;
  let disableClick = false;
  const touchstart = () => (tap = true);
  const touchmove = () => (tap = false);
  const touchend = event => {
    if (tap) {
      // Reset state
      tap = false;
      // Disable click so we don't call handler twice
      disableClick = true;
      handler(event);
      return;
    }
    // Make sure tap event hasn't disabled click
    if (event.type === 'click' && !disableClick) {
      handler(event);
    }
    // Reset state
    disableClick = false;
  };
  // Add event handlers
  on(element, 'touchstart', touchstart);
  on(element, 'touchmove', touchmove);
  on(element, 'click', touchend);
  on(element, 'touchend', touchend);
  // Return function that removes event handlers
  return () => {
    off(element, 'touchstart', touchstart);
    off(element, 'touchmove', touchmove);
    off(element, 'click', touchend);
    off(element, 'touchend', touchend);
  };
};

export const addHorizontalSwipeHandler = (
  element,
  handler,
  { maxSwipeTime, minHorizontalSwipeDistance, maxVerticalSwipeDistance },
) => {
  if (!element || !element.addEventListener || !isFunction(handler)) {
    return null;
  }
  // State variables
  let startX = 0;
  let startY = 0;
  let startTime = null;
  let isSwiping = false;
  // Touch start handler
  function touchStart(e) {
    const t = e.changedTouches[0];
    startX = t.screenX;
    startY = t.screenY;
    startTime = new Date().getTime();
    isSwiping = true;
  }
  // Touch end handler
  function touchEnd(e) {
    if (!isSwiping) return;
    isSwiping = false;
    const t = e.changedTouches[0];
    const deltaX = t.screenX - startX;
    const deltaY = t.screenY - startY;
    const deltaTime = new Date().getTime() - startTime;
    if (deltaTime < maxSwipeTime) {
      if (
        Math.abs(deltaX) >= minHorizontalSwipeDistance &&
        Math.abs(deltaY) <= maxVerticalSwipeDistance
      ) {
        const arg = { toLeft: false, toRight: false };
        if (deltaX < 0) {
          // Swipe to the left
          arg.toLeft = true;
        } else {
          // Swipe to the right
          arg.toRight = true;
        }
        handler(arg);
      }
    }
  }
  // Add event handlers
  on(element, 'touchstart', touchStart);
  // on(element, 'touchmove', touchmove);
  on(element, 'touchend', touchEnd);
  // Return function that removes event handlers
  return () => {
    off(element, 'touchstart', touchStart);
    // off(element, 'touchmove', touchmove);
    off(element, 'touchend', touchEnd);
  };
};
