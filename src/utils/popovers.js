import { elementContains } from './helpers';

export function showPopover(opts) {
  if (document) {
    document.dispatchEvent(
      new CustomEvent('show-popover', {
        detail: opts,
      }),
    );
  }
}

export function hidePopover(opts) {
  if (document) {
    document.dispatchEvent(
      new CustomEvent('hide-popover', {
        detail: opts,
      }),
    );
  }
}

export function togglePopover(opts) {
  if (document) {
    document.dispatchEvent(
      new CustomEvent('toggle-popover', {
        detail: opts,
      }),
    );
  }
}

export function updatePopover(opts) {
  if (document) {
    document.dispatchEvent(
      new CustomEvent('update-popover', {
        detail: opts,
      }),
    );
  }
}

export function getPopoverTriggerEvents(opts) {
  const { visibility } = opts;
  const click = visibility === 'click';
  const hover = visibility === 'hover';
  const hoverFocus = visibility === 'hover-focus';
  const focus = visibility === 'focus';
  opts.autoHide = !click;
  let hovered = false;
  let focused = false;
  const { isRenderFn } = opts;
  const events = {
    click: isRenderFn ? 'onClick' : 'click',
    mousemove: isRenderFn ? 'onMousemove' : 'mousemove',
    mouseleave: isRenderFn ? 'onMouseleave' : 'mouseleave',
    focusin: isRenderFn ? 'onFocusin' : 'focusin',
    focusout: isRenderFn ? 'onFocusout' : 'focusout',
  };
  return {
    [events.click](e) {
      if (click) {
        opts.ref = e.target;
        togglePopover(opts);
      }
    },
    [events.mousemove](e) {
      opts.ref = e.currentTarget;
      if (!hovered) {
        hovered = true;
        if (hover || hoverFocus) {
          showPopover(opts);
        }
      }
    },
    [events.mouseleave](e) {
      opts.ref = e.target;
      if (hovered) {
        hovered = false;
        if (hover || (hoverFocus && !focused)) {
          hidePopover(opts);
        }
      }
    },
    [events.focusin](e) {
      opts.ref = e.currentTarget;
      if (!focused) {
        focused = true;
        if (focus || hoverFocus) {
          showPopover(opts);
        }
      }
    },
    [events.focusout](e) {
      opts.ref = e.currentTarget;
      if (focused && !elementContains(opts.ref, e.relatedTarget)) {
        focused = false;
        if (focus || (hoverFocus && !hovered)) {
          hidePopover(opts);
        }
      }
    },
  };
}
