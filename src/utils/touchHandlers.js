import defaults from './defaults';
import { isFunction } from './typeCheckers';

export const registerTapOrClick = (element, handler) => {
  if (!element || !element.addEventListener || !isFunction(handler)) return null;
  const registration = {
    touchState: null,
  };
  const onTouchStart = (e) => {
    const t = e.targetTouches[0];
    registration.touchState = {
      started: true,
      startedOn: new Date(),
      startX: t.screenX,
      startY: t.screenY,
      x: t.screenX,
      y: t.screenY,
    };
  };
  const onTouchEnd = (e) => {
    const state = registration.touchState;
    if (!state || !state.started) return;
    const t = e.changedTouches[0];
    state.x = t.screenX;
    state.y = t.screenY;
    state.tapDetected = new Date() - state.startedOn <= defaults.maxTapDuration &&
      Math.abs(state.x - state.startX) <= defaults.maxTapTolerance &&
      Math.abs(state.y - state.startY) <= defaults.maxTapTolerance;
    if (state.tapDetected) {
      handler(e);
    }
    state.started = false;
  };
  const onClick = (e) => {
    const state = registration.touchState;
    if (state && state.tapDetected) return;
    handler(e);
  };
  element.addEventListener('touchstart', onTouchStart);
  element.addEventListener('touchend', onTouchEnd);
  element.addEventListener('click', onClick);
  registration.cleanup = () => {
    element.removeEventListener('touchstart', onTouchStart);
    element.removeEventListener('touchend', onTouchEnd);
    element.removeEventListener('click', onClick);
  };
  return registration;
};
