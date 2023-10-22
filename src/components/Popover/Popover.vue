<template>
  <Teleport :to="teleport" :disabled="!teleport">
    <div
      class="vc-popover-content-wrapper"
      :class="{ 'is-interactive': isInteractive }"
      :style="popoverStyle"
      ref="popoverRef"
      @click="onClick"
      @mouseover="onMouseOver"
      @mouseleave="onMouseLeave"
      @focusin="onFocusIn"
      @focusout="onFocusOut"
    >
      <Transition
        :name="`vc-${transition}`"
        appear
        @before-enter="beforeEnter"
        @after-enter="afterEnter"
        @before-leave="beforeLeave"
        @after-leave="afterLeave"
      >
        <div
          v-if="isVisible"
          tabindex="-1"
          :class="`vc-popover-content direction-${direction}`"
          v-bind="$attrs"
        >
          <slot
            :direction="direction"
            :alignment="alignment"
            :data="data"
            :hide="hide"
          >
            {{ data }}
          </slot>
          <span
            :class="[
              'vc-popover-caret',
              `direction-${direction}`,
              `align-${alignment}`,
            ]"
          />
        </div>
      </Transition>
    </div>
  </Teleport>
</template>

<script lang="ts">
import { flip, autoUpdate, computePosition } from '@floating-ui/dom';

import {
  computed,
  defineComponent,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  toRefs,
  watchEffect,
} from 'vue';
import {
  type ElementTarget,
  elementContains,
  off,
  omit,
  on,
  resolveEl,
  isBoolean,
} from '../../utils/helpers';
import type {
  PopoverEvent,
  PopoverPlacement,
  PopoverOptions,
} from '../../utils/popovers';

interface PopoverState
  extends Pick<
    PopoverOptions,
    | 'placement'
    | 'flip'
    | 'positionFixed'
    | 'isInteractive'
    | 'visibility'
    | 'autoHide'
  > {
  isVisible: boolean;
  target: ElementTarget;
  data: any;
  transition: string;
  isHovered: boolean;
  isFocused: boolean;
  force: boolean;
}

export default defineComponent({
  inheritAttrs: false,
  emits: ['before-show', 'after-show', 'before-hide', 'after-hide'],
  props: {
    id: { type: [Number, String, Symbol], required: true },
    showDelay: { type: Number, default: 0 },
    hideDelay: { type: Number, default: 110 },
    teleport: { type: [String, Object], default: 'body' },
  },
  setup(props, { emit }) {
    let timeout: number | undefined = undefined;
    const popoverRef = ref<HTMLElement | undefined>();

    const state = reactive<PopoverState>({
      isVisible: false,
      target: null,
      data: null,
      transition: 'slide-fade',
      placement: 'bottom',
      positionFixed: false,
      flip: true,
      isInteractive: true,
      visibility: 'click',
      isHovered: false,
      isFocused: false,
      autoHide: false,
      force: false,
    });

    const popoverStyle = ref({});
    const actualPlacement = ref<PopoverPlacement | null>(null);

    const middleware = computed(() => {
      if (state.flip) {
        return [flip(isBoolean(state.flip) ? undefined : state.flip)];
      }
      return [];
    });

    const direction = computed(() => {
      const placement = actualPlacement.value ?? state.placement ?? '';
      return placement.split('-')[0];
    });

    const alignment = computed(() => {
      const isLeftRight =
        direction.value === 'left' || direction.value === 'right';
      let alignment = '';
      const placement = actualPlacement.value ?? state.placement ?? '';
      const parts = placement.split('-');
      if (parts.length > 1) alignment = parts[1];
      if (['start', 'top', 'left'].includes(alignment)) {
        return isLeftRight ? 'top' : 'left';
      }
      if (['end', 'bottom', 'right'].includes(alignment)) {
        return isLeftRight ? 'bottom' : 'right';
      }
      return isLeftRight ? 'middle' : 'center';
    });

    function updateState(newState: Partial<PopoverState>) {
      Object.assign(state, omit(newState, 'force'));
    }

    function setTimer(delay: number, fn: Function) {
      clearTimeout(timeout);
      if (delay > 0) {
        timeout = setTimeout(fn, delay);
      } else {
        fn();
      }
    }

    function isCurrentTarget(target: ElementTarget) {
      if (!target || !state.target) return false;
      const targetEl = resolveEl(target);
      const currentEl = resolveEl(state.target);
      return targetEl === currentEl;
    }

    async function show(opts: Partial<PopoverOptions> = {}) {
      if (state.force) return;
      if (opts.force) state.force = true;

      setTimer(opts.showDelay ?? props.showDelay, () => {
        if (state.isVisible) {
          state.force = false;
        }
        updateState({
          ...opts,
          isVisible: true,
        });
      });
    }

    function hide(opts: Partial<PopoverOptions> = {}) {
      if (opts.target && !isCurrentTarget(opts.target)) return;
      if (state.force) return;
      if (opts.force) state.force = true;
      setTimer(opts.hideDelay ?? props.hideDelay, () => {
        if (!state.isVisible) state.force = false;
        state.isVisible = false;
      });
    }

    function toggle(opts: Partial<PopoverOptions> = {}) {
      if (opts.target == null) return;
      if (state.isVisible && isCurrentTarget(opts.target)) {
        hide(opts);
      } else {
        show(opts);
      }
    }

    function onDocumentClick(e: CustomEvent) {
      // Don't hide if target element is contained within popover ref or content
      if (!popoverRef.value) return;
      const anchor = resolveEl(state.target);
      if (anchor == null) return;
      const target = e.target as Node;
      if (
        elementContains(popoverRef.value, target) ||
        elementContains(anchor, target)
      ) {
        return;
      }
      // Hide the popover
      hide({ force: true });
    }

    function onDocumentKeydown(e: KeyboardEvent) {
      if (e.key === 'Esc' || e.key === 'Escape') {
        hide();
      }
    }

    function onDocumentShowPopover({ detail }: PopoverEvent) {
      if (!detail.id || detail.id !== props.id) return;
      show(detail);
    }

    function onDocumentHidePopover({ detail }: PopoverEvent) {
      if (!detail.id || detail.id !== props.id) return;
      hide(detail);
    }

    function onDocumentTogglePopover({ detail }: PopoverEvent) {
      if (!detail.id || detail.id !== props.id) return;
      toggle(detail);
    }

    function addEvents() {
      on(document, 'keydown', onDocumentKeydown);
      on(document, 'click', onDocumentClick);
      on(document, 'show-popover', onDocumentShowPopover);
      on(document, 'hide-popover', onDocumentHidePopover);
      on(document, 'toggle-popover', onDocumentTogglePopover);
    }

    function removeEvents() {
      off(document, 'keydown', onDocumentKeydown);
      off(document, 'click', onDocumentClick);
      off(document, 'show-popover', onDocumentShowPopover);
      off(document, 'hide-popover', onDocumentHidePopover);
      off(document, 'toggle-popover', onDocumentTogglePopover);
    }

    function beforeEnter(el: Element) {
      emit('before-show', el);
    }

    function afterEnter(el: Element) {
      state.force = false;
      emit('after-show', el);
    }

    function beforeLeave(el: Element) {
      emit('before-hide', el);
    }

    function afterLeave(el: Element) {
      state.force = false;
      emit('after-hide', el);
    }

    function onClick(e: MouseEvent) {
      e.stopPropagation();
    }

    function onMouseOver() {
      state.isHovered = true;
      if (
        state.isInteractive &&
        ['hover', 'hover-focus'].includes(state.visibility)
      ) {
        show();
      }
    }

    function onMouseLeave() {
      state.isHovered = false;
      const el = resolveEl(state.target);
      if (
        state.autoHide &&
        !state.isFocused &&
        (!el || el !== document.activeElement) &&
        ['hover', 'hover-focus'].includes(state.visibility)
      ) {
        hide();
      }
    }

    function onFocusIn() {
      state.isFocused = true;
      if (
        state.isInteractive &&
        ['focus', 'hover-focus'].includes(state.visibility)
      ) {
        show();
      }
    }

    function onFocusOut(e: FocusEvent) {
      if (
        ['focus', 'hover-focus'].includes(state.visibility) &&
        (!e.relatedTarget ||
          !elementContains(popoverRef.value!, e.relatedTarget as Node))
      ) {
        state.isFocused = false;
        if (!state.isHovered && state.autoHide) hide();
      }
    }

    let cleanup: null | (() => void) = null;
    watchEffect(() => {
      const el = resolveEl(state.target);
      if (!el || !popoverRef.value) return;
      if (cleanup != null) {
        cleanup();
      }
      cleanup = autoUpdate(el, popoverRef.value, () => {
        if (el == null || popoverRef.value == null) return;
        computePosition(el, popoverRef.value, {
          placement: state.placement,
          strategy: state.positionFixed ? 'fixed' : 'absolute',
          middleware: [...middleware.value],
        }).then(({ x, y, placement }) => {
          actualPlacement.value = placement;
          popoverStyle.value = {
            left: `${x}px`,
            top: `${y}px`,
          };
        });
      });
    });

    onMounted(() => {
      addEvents();
    });

    onUnmounted(() => {
      removeEvents();
    });

    return {
      ...toRefs(state),
      actualPlacement,
      popoverRef,
      popoverStyle,
      direction,
      alignment,
      middleware,
      hide,
      beforeEnter,
      afterEnter,
      beforeLeave,
      afterLeave,
      onClick,
      onMouseOver,
      onMouseLeave,
      onFocusIn,
      onFocusOut,
    };
  },
});
</script>

<style lang="css">
.vc-popover-content-wrapper {
  position: absolute;
  width: max-content;
  top: 0;
  left: 0;
  display: block;
  outline: none;
  z-index: 10;
  &:not(.is-interactive) {
    pointer-events: none;
  }
}

.vc-popover-content {
  position: relative;
  color: var(--vc-popover-content-color);
  font-weight: var(--vc-font-medium);
  background-color: var(--vc-popover-content-bg);
  border: 1px solid;
  border-color: var(--vc-popover-content-border);
  border-radius: var(--vc-rounded-lg);
  padding: 4px;
  outline: none;
  z-index: 10;
  box-shadow: var(--vc-shadow-lg);
  &.direction-bottom {
    margin-top: var(--vc-popover-content-offset-vertical);
  }
  &.direction-top {
    margin-bottom: var(--vc-popover-content-offset-vertical);
  }
  &.direction-left {
    margin-right: var(--vc-popover-content-offset-horizontal);
  }
  &.direction-right {
    margin-left: var(--vc-popover-content-offset-horizontal);
  }
}

.vc-popover-caret {
  content: '';
  position: absolute;
  display: block;
  width: 12px;
  height: 12px;
  border-top: inherit;
  border-left: inherit;
  background-color: inherit;
  z-index: -1;
  &.direction-bottom {
    top: 0;
    &.align-left {
      transform: translateY(-50%) rotate(45deg);
    }
    &.align-center {
      transform: translateX(-50%) translateY(-50%) rotate(45deg);
    }
    &.align-right {
      transform: translateY(-50%) rotate(45deg);
    }
  }
  &.direction-top {
    top: 100%;
    &.align-left {
      transform: translateY(-50%) rotate(-135deg);
    }
    &.align-center {
      transform: translateX(-50%) translateY(-50%) rotate(-135deg);
    }
    &.align-right {
      transform: translateY(-50%) rotate(-135deg);
    }
  }
  &.direction-left {
    left: 100%;
    &.align-top {
      transform: translateX(-50%) rotate(135deg);
    }
    &.align-middle {
      transform: translateY(-50%) translateX(-50%) rotate(135deg);
    }
    &.align-bottom {
      transform: translateX(-50%) rotate(135deg);
    }
  }
  &.direction-right {
    left: 0;
    &.align-top {
      transform: translateX(-50%) rotate(-45deg);
    }
    &.align-middle {
      transform: translateY(-50%) translateX(-50%) rotate(-45deg);
    }
    &.align-bottom {
      transform: translateX(-50%) rotate(-45deg);
    }
  }
  &.align-left {
    left: var(--vc-popover-caret-offset-horizontal);
  }
  &.align-center {
    left: 50%;
  }
  &.align-right {
    right: var(--vc-popover-caret-offset-horizontal);
  }
  &.align-top {
    top: var(--vc-popover-caret-offset-vertical);
  }
  &.align-middle {
    top: 50%;
  }
  &.align-bottom {
    bottom: var(--vc-popover-caret-offset-vertical);
  }
}
</style>
