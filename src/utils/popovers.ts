import { Directive, DirectiveBinding } from 'vue';
import { elementContains, on, createGuid } from './helpers';
import { Placement } from '@popperjs/core';

export type PopoverVisibility = 'click' | 'hover' | 'hover-focus' | 'focus';

export interface PopoverOptions {
  id: string;
  visibility: PopoverVisibility;
  isInteractive: boolean;
  autoHide: boolean;
  ref?: HTMLElement;
  refSelector: string;
  placement: Placement;
  modifiers: any;
  data: any;
  renderFn: boolean;
  showDelay: number;
  hideDelay: number;
}

export interface PopoverEvent {
  detail: Partial<PopoverOptions>;
}

interface PopoverEventHandlers {
  click: (e: MouseEvent) => void;
  mousemove: (e: MouseEvent) => void;
  mouseleave: (e: MouseEvent) => void;
  focusin: (e: MouseEvent) => void;
  focusout: (e: MouseEvent) => void;
}

const attributeName = 'data-popover-ref-id';

const setRefSelector = (opts: Partial<PopoverOptions>) => {
  if (opts.ref && !opts.refSelector) {
    const attributeValue = opts.ref.getAttribute(attributeName) || createGuid();
    opts.ref.setAttribute(attributeName, attributeValue);
    opts.refSelector = `[${attributeName}="${attributeValue}"]`;
  }
  delete opts.ref;
};

export function showPopover(opts: Partial<PopoverOptions>) {
  if (document) {
    setRefSelector(opts);
    document.dispatchEvent(
      new CustomEvent('show-popover', {
        detail: opts,
      }),
    );
  }
}

export function togglePopover(opts: Partial<PopoverOptions>) {
  if (document) {
    setRefSelector(opts);
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

export function hidePopover(opts: Partial<PopoverOptions>) {
  if (document) {
    document.dispatchEvent(
      new CustomEvent('hide-popover', {
        detail: opts,
      }),
    );
  }
}

export function getPopoverEventHandlers(
  opts: Partial<PopoverOptions>,
): Partial<PopoverEventHandlers> {
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
      opts.ref = e.currentTarget as HTMLElement;
      togglePopover(opts);
      e.stopPropagation();
    }
  };
  const mouseMoveHandler = (e: MouseEvent) => {
    if (!hovered) {
      hovered = true;
      if (hover || hoverFocus) {
        opts.ref = e.currentTarget as HTMLElement;
        showPopover(opts);
      }
    }
  };
  const mouseLeaveHandler = () => {
    if (hovered) {
      hovered = false;
      if (hover || (hoverFocus && !focused)) {
        hidePopover(opts);
      }
    }
  };
  const focusInHandler = (e: FocusEvent) => {
    if (!focused) {
      focused = true;
      if (focus || hoverFocus) {
        opts.ref = e.currentTarget as HTMLElement;
        showPopover(opts);
      }
    }
  };
  const focusOutHandler = (e: FocusEvent) => {
    if (
      focused &&
      !elementContains(e.currentTarget as Node, e.relatedTarget as Element)
    ) {
      focused = false;
      if (focus || (hoverFocus && !hovered)) {
        hidePopover(opts);
      }
    }
  };
  const renderFn = opts.renderFn;
  const handlers: Record<string, Function> = {};
  switch (opts.visibility) {
    case 'click':
      handlers[renderFn ? 'onClick' : 'click'] = clickHandler;
      break;
    case 'hover':
      handlers[renderFn ? 'onMousemove' : 'mousemove'] = mouseMoveHandler;
      handlers[renderFn ? 'onMouseleave' : 'mouseleave'] = mouseLeaveHandler;
      break;
    case 'focus':
      handlers[renderFn ? 'onFocusin' : 'focusin'] = focusInHandler;
      handlers[renderFn ? 'onFocusout' : 'focusout'] = focusOutHandler;
      break;
    case 'hover-focus':
      handlers[renderFn ? 'onMousemove' : 'mousemove'] = mouseMoveHandler;
      handlers[renderFn ? 'onMouseleave' : 'mouseleave'] = mouseLeaveHandler;
      handlers[renderFn ? 'onFocusin' : 'focusin'] = focusInHandler;
      handlers[renderFn ? 'onFocusout' : 'focusout'] = focusOutHandler;
      break;
  }
  return handlers;
}

const removeHandlers = (el: any) => {
  const handlers = el.popoverHandlers;
  if (!handlers || !handlers.length) return;
  handlers.forEach((handler: Function) => handler());
  delete el.popoverHandlers;
};

const addHandlers = (el: any, opts: Partial<PopoverOptions>) => {
  const remove: Function[] = [];
  const handlers = getPopoverEventHandlers(opts);
  Object.entries(handlers).forEach(([event, handler]) => {
    remove.push(on(el, event, handler as EventListener));
  });
  el.popoverHandlers = remove;
};

export const popoverDirective: Directive = {
  mounted(el: any, binding: DirectiveBinding<PopoverOptions>) {
    const { value } = binding;
    if (!value) return;
    value.ref = el;
    addHandlers(el, value);
  },
  updated(el: any, binding: DirectiveBinding<PopoverOptions>) {
    const { oldValue, value } = binding;
    const oldVisibility = oldValue?.visibility;
    const newVisibility = value?.visibility;
    if (oldVisibility !== newVisibility) {
      if (oldVisibility) {
        removeHandlers(el);
        if (!newVisibility) hidePopover(oldValue);
      }
      if (newVisibility) addHandlers(el, value);
    } else if (value) {
      updatePopover(value);
    }
  },
  unmounted(el: Element) {
    removeHandlers(el);
  },
};
