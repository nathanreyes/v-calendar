import { elementContains } from './helpers';
import { Placement, OptionsGeneric, Modifier } from '@popperjs/core';

export type PopoverVisibility = 'click' | 'hover' | 'hover-focus' | 'focus';

export interface PopoverOptions {
  id: string;
  visibility: PopoverVisibility;
  isInteractive: boolean;
  autoHide: boolean;
  ref: EventTarget | null;
  placement: Placement;
  modifiers: any;
  data: any;
}

interface PopoverTriggerEvents {
  click: (e: MouseEvent) => void;
  mousemove: (e: MouseEvent) => void;
  mouseleave: (e: MouseEvent) => void;
  focusin: (e: MouseEvent) => void;
  focusout: (e: MouseEvent) => void;
}

interface PopoverTriggerEventsRenderFn {
  onClick: (e: MouseEvent) => void;
  onMousemove: (e: MouseEvent) => void;
  onMouseleave: (e: MouseEvent) => void;
  onFocusin: (e: MouseEvent) => void;
  onFocusout: (e: MouseEvent) => void;
}

export function showPopover(opts: Partial<PopoverOptions>) {
  if (document) {
    document.dispatchEvent(
      new CustomEvent('show-popover', {
        detail: opts,
      }),
    );
  }
}

export function hidePopover(opts: Partial<PopoverOptions>) {
  if (document) {
    document.dispatchEvent(
      new CustomEvent('hide-popover', {
        detail: opts,
      }),
    );
  }
}

export function togglePopover(opts: Partial<PopoverOptions>) {
  if (document) {
    document.dispatchEvent(
      new CustomEvent('toggle-popover', {
        detail: opts,
      }),
    );
  }
}

export function updatePopover(opts: Partial<PopoverOptions>) {
  if (document) {
    document.dispatchEvent(
      new CustomEvent('update-popover', {
        detail: opts,
      }),
    );
  }
}

export function getPopoverTriggerEvents(
  opts: Partial<PopoverOptions>,
): PopoverTriggerEvents {
  const { visibility } = opts;
  const click = visibility === 'click';
  const hover = visibility === 'hover';
  const hoverFocus = visibility === 'hover-focus';
  const focus = visibility === 'focus';
  opts.autoHide = !click;
  let hovered = false;
  let focused = false;
  const clickHandler = (e: MouseEvent) => {
    if (click) {
      opts.ref = e.target;
      togglePopover(opts);
      e.stopPropagation();
    }
  };
  const mouseMoveHandler = (e: MouseEvent) => {
    opts.ref = e.currentTarget;
    if (!hovered) {
      hovered = true;
      if (hover || hoverFocus) {
        showPopover(opts);
      }
    }
  };
  const mouseLeaveHandler = (e: MouseEvent) => {
    opts.ref = e.target;
    if (hovered) {
      hovered = false;
      if (hover || (hoverFocus && !focused)) {
        hidePopover(opts);
      }
    }
  };
  const focusInHandler = (e: FocusEvent) => {
    opts.ref = e.currentTarget;
    if (!focused) {
      focused = true;
      if (focus || hoverFocus) {
        showPopover(opts);
      }
    }
  };
  const focusOutHandler = (e: FocusEvent) => {
    opts.ref = e.currentTarget;
    if (
      focused &&
      opts.ref &&
      !elementContains(opts.ref as Element, e.relatedTarget as Element)
    ) {
      focused = false;
      if (focus || (hoverFocus && !hovered)) {
        hidePopover(opts);
      }
    }
  };

  return {
    click: clickHandler,
    mousemove: mouseMoveHandler,
    mouseleave: mouseLeaveHandler,
    focusin: focusInHandler,
    focusout: focusOutHandler,
  };
}

export function getPopoverTriggerEventsRenderFn(
  opts: Partial<PopoverOptions>,
): PopoverTriggerEventsRenderFn {
  const {
    click,
    mousemove,
    mouseleave,
    focusin,
    focusout,
  } = getPopoverTriggerEvents(opts);
  return {
    onClick: click,
    onMousemove: mousemove,
    onMouseleave: mouseleave,
    onFocusin: focusin,
    onFocusout: focusout,
  };
}
