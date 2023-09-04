import { isFunction, off, on } from './helpers';
import type { CustomElement } from './helpers';

interface SwipeHandlerOptions {
  maxSwipeTime: number;
  minHorizontalSwipeDistance: number;
  maxVerticalSwipeDistance: number;
}

export const addHorizontalSwipeHandler = (
  element: CustomElement,
  handler: Function,
  {
    maxSwipeTime,
    minHorizontalSwipeDistance,
    maxVerticalSwipeDistance,
  }: SwipeHandlerOptions,
) => {
  if (!element || !element.addEventListener || !isFunction(handler)) {
    return null;
  }
  // State variables
  let startX = 0;
  let startY = 0;
  let startTime: number | null = null;
  let isSwiping = false;
  // Touch start handler
  function touchStart(e: TouchEvent) {
    const t = e.changedTouches[0];
    startX = t.screenX;
    startY = t.screenY;
    startTime = new Date().getTime();
    isSwiping = true;
  }
  // Touch end handler
  function touchEnd(e: TouchEvent) {
    if (!isSwiping || !startTime) return;
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
