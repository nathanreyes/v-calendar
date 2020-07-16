import { elementContains } from './helpers';

export function showPopover(opts) {
  if (!(opts.ref instanceof HTMLElement)) return;
  document.dispatchEvent(
    new CustomEvent('show-popover', {
      detail: opts,
    }),
  );
}

export function hidePopover(opts) {
  document.dispatchEvent(
    new CustomEvent('hide-popover', {
      detail: opts,
    }),
  );
}

export function togglePopover(opts) {
  document.dispatchEvent(
    new CustomEvent('toggle-popover', {
      detail: opts,
    }),
  );
}

export function getPopoverTriggerEvents(opts) {
  const events = {};
  const { visibility, onCompleted } = opts;
  const isClick = visibility === 'click';
  const isHover = visibility === 'hover';
  const isHoverFocus = visibility === 'hover-focus';
  const isFocus = visibility === 'focus';
  let isActive = false;
  let isHovered = false;
  let isFocused = false;

  function show() {
    showPopover(opts);
    isActive = true;
  }

  function hide() {
    opts.onCompletion = hidePopover(opts);
    isActive = false;
  }

  function refresh() {
    switch (visibility) {
      case 'hover':
        if (isHovered) {
          show();
        } else if (isActive) {
          hide();
        }
        break;
      case 'focus':
        if (isFocused) {
          show();
        } else if (isActive) {
          hide();
        }
        break;
      case 'hover-focus':
        if (isHovered || isFocused) {
          show();
        } else if (isActive) {
          hide();
        }
        break;
      case 'visible':
        show();
        break;
      case 'hidden':
        if (isActive) {
          hide();
        }
        break;
    }
  }

  events.click = e => {
    if (isClick) {
      opts.ref = e.target;
      if (isActive) {
        hide();
      } else {
        show();
      }
      e.stopPropagation();
    }
  };

  events.mouseover = e => {
    opts.ref = e.currentTarget;
    if (!isHovered) {
      isHovered = true;
      if (isHover || isHoverFocus) {
        refresh();
      }
    }
  };

  events.mouseleave = e => {
    opts.ref = e.target;
    if (isHovered) {
      isHovered = false;
      if (isHover || (isHoverFocus && !isFocused)) {
        refresh();
      }
    }
  };

  events.focusin = e => {
    opts.ref = e.currentTarget;
    if (!isFocused) {
      isFocused = true;
      if (isFocus) {
        refresh();
      }
    }
  };

  events.focusout = e => {
    opts.ref = e.currentTarget;
    if (isFocused && !elementContains(opts.ref, e.relatedTarget)) {
      isFocused = false;
      if (isHoverFocus || isFocus) {
        refresh();
      }
    }
  };

  return events;
}
