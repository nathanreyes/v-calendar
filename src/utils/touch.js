import { on, off } from './helpers';
import { isFunction } from './_';

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
  on(element, 'touchstart', touchStart, { passive: true });
  // on(element, 'touchmove', touchmove);
  on(element, 'touchend', touchEnd, { passive: true });
  // Return function that removes event handlers
  return () => {
    off(element, 'touchstart', touchStart);
    // off(element, 'touchmove', touchmove);
    off(element, 'touchend', touchEnd);
  };
};
