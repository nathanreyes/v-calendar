import type { ComponentPublicInstance, Directive, DirectiveBinding } from 'vue';
import type { Placement } from '@popperjs/core';
import { elementContains, on, resolveEl } from './helpers';

export type PopoverVisibility = 'click' | 'hover' | 'hover-focus' | 'focus';

export interface PopoverOptions {
  id: string;
  visibility: PopoverVisibility;
  isInteractive: boolean;
  autoHide: boolean;
  force: boolean;
  target: unknown;
  placement: Placement;
  modifiers: any;
  data: any;
  showDelay: number;
  hideDelay: number;
}

export interface PopoverState {
  isVisible: boolean;
  target: unknown;
  data: any;
  transition: string;
  placement: Placement;
  direction: string;
  positionFixed: false;
  modifiers: any[];
  isInteractive: boolean;
  visibility: PopoverVisibility;
  isHovered: boolean;
  isFocused: boolean;
  autoHide: boolean;
  force: boolean;
}

export interface PopoverEvent {
  detail: Partial<PopoverOptions>;
}

export interface PopoverEventHandlers {
  click: (e: MouseEvent) => void;
  mousemove: (e: MouseEvent) => void;
  mouseleave: (e: MouseEvent) => void;
  focusin: (e: MouseEvent) => void;
  focusout: (e: MouseEvent) => void;
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
      togglePopover({
        ...opts,
        target: opts.target || (e.currentTarget as HTMLElement),
      });
      e.stopPropagation();
    }
  };
  const mouseMoveHandler = (e: MouseEvent) => {
    if (!hovered) {
      hovered = true;
      if (hover || hoverFocus) {
        showPopover({
          ...opts,
          target: opts.target || (e.currentTarget as HTMLElement),
        });
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
        showPopover({
          ...opts,
          target: opts.target || (e.currentTarget as HTMLElement),
        });
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

  const handlers: Record<string, Function> = {};
  switch (opts.visibility) {
    case 'click':
      handlers.click = clickHandler;
      break;
    case 'hover':
      handlers.mousemove = mouseMoveHandler;
      handlers.mouseleave = mouseLeaveHandler;
      break;
    case 'focus':
      handlers.focusin = focusInHandler;
      handlers.focusout = focusOutHandler;
      break;
    case 'hover-focus':
      handlers.mousemove = mouseMoveHandler;
      handlers.mouseleave = mouseLeaveHandler;
      handlers.focusin = focusInHandler;
      handlers.focusout = focusOutHandler;
      break;
  }
  return handlers;
}

const removeHandlers = (target: Element | ComponentPublicInstance | string) => {
  const el = resolveEl(target);
  if (el == null) return;
  const handlers = (el as any).popoverHandlers;
  if (!handlers || !handlers.length) return;
  handlers.forEach((handler: Function) => handler());
  delete (el as any).popoverHandlers;
};

const addHandlers = (
  target: Element | ComponentPublicInstance | string,
  opts: Partial<PopoverOptions>,
) => {
  const el = resolveEl(target);
  if (el == null) return;
  const remove: Function[] = [];
  const handlers = getPopoverEventHandlers(opts);
  Object.entries(handlers).forEach(([event, handler]) => {
    remove.push(on(el, event, handler as EventListener));
  });
  (el as any).popoverHandlers = remove;
};

export const popoverDirective: Directive = {
  mounted(el: any, binding: DirectiveBinding<PopoverOptions>) {
    const { value } = binding;
    if (!value) return;
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
      if (newVisibility) {
        addHandlers(el, value);
      }
    }
  },
  unmounted(el: Element) {
    removeHandlers(el);
  },
};
