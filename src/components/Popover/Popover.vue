<template>
  <div
    class="vc-popover-content-wrapper"
    :class="{ 'is-interactive': isInteractive }"
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
</template>

<script lang="ts">
import {
  type Instance,
  type OptionsGeneric,
  type State as PopperState,
  type PositioningStrategy,
  createPopper,
} from '@popperjs/core';
import {
  computed,
  defineComponent,
  nextTick,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  toRefs,
  watch,
} from 'vue';
import { elementContains, off, omit, on, resolveEl } from '../../utils/helpers';
import type {
  PopoverEvent,
  PopoverOptions,
  PopoverState,
} from '../../utils/popovers';

export default defineComponent({
  inheritAttrs: false,
  emits: ['before-show', 'after-show', 'before-hide', 'after-hide'],
  props: {
    id: { type: [Number, String, Symbol], required: true },
    showDelay: { type: Number, default: 0 },
    hideDelay: { type: Number, default: 110 },
    boundarySelector: { type: String },
  },
  setup(props, { emit }) {
    let timeout: number | undefined = undefined;
    const popoverRef = ref<HTMLElement>();
    let resizeObserver: ResizeObserver | null = null;
    let popper: Instance | null = null;

    const state: PopoverState = reactive({
      isVisible: false,
      target: null,
      data: null,
      transition: 'slide-fade',
      placement: 'bottom',
      direction: '',
      positionFixed: false,
      modifiers: [],
      isInteractive: true,
      visibility: 'click',
      isHovered: false,
      isFocused: false,
      autoHide: false,
      force: false,
    });

    function updateDirection(placement?: string) {
      if (placement) state.direction = placement.split('-')[0];
    }

    function onPopperUpdate({ placement, options }: Partial<PopperState>) {
      updateDirection(placement || options?.placement);
    }

    const popperOptions = computed<Partial<OptionsGeneric<any>>>(() => {
      return {
        placement: state.placement,
        strategy: (state.positionFixed
          ? 'fixed'
          : 'absolute') as PositioningStrategy,
        boundary: '',
        modifiers: [
          {
            name: 'onUpdate',
            enabled: true,
            phase: 'afterWrite',
            fn: onPopperUpdate,
          },
          ...(state.modifiers || []),
        ],
        onFirstUpdate: onPopperUpdate,
      };
      // if (props.boundarySelector) {
      //   const boundary = document.querySelector(props.boundarySelector);
      //   modifiers.push({
      //     name: 'boundary',
      //     enabled: true,
      //     phase: 'main',
      //     requiresIfExists: ['offset'],
      //     fn({ state }) {
      //       console.log(
      //         detectOverflow(state, {
      //           boundary,
      //           altBoundary: true,
      //         }),
      //       );
      //     },
      //   });
      // }
    });

    const alignment = computed(() => {
      const isLeftRight =
        state.direction === 'left' || state.direction === 'right';
      let alignment = '';
      if (state.placement) {
        const parts = state.placement.split('-');
        if (parts.length > 1) alignment = parts[1];
      }
      if (['start', 'top', 'left'].includes(alignment)) {
        return isLeftRight ? 'top' : 'left';
      }
      if (['end', 'bottom', 'right'].includes(alignment)) {
        return isLeftRight ? 'bottom' : 'right';
      }
      return isLeftRight ? 'middle' : 'center';
    });

    function destroyPopper() {
      if (popper) {
        popper.destroy();
        popper = null;
      }
    }

    function setupPopper() {
      nextTick(() => {
        const el = resolveEl(state.target);
        if (!el || !popoverRef.value) return;
        if (popper && popper.state.elements.reference !== el) {
          destroyPopper();
        }
        if (!popper) {
          popper = createPopper(
            el as Element,
            popoverRef.value,
            popperOptions.value,
          );
        } else {
          popper.update();
        }
      });
    }

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

    function isCurrentTarget(target: unknown) {
      if (!target || !popper) return false;
      const el = resolveEl(target);
      return el === popper.state.elements.reference;
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
        setupPopper();
      });
    }

    function hide(opts: Partial<PopoverOptions> = {}) {
      if (!popper) return;
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
      if (!popper) return;
      const popperRef = popper.state.elements.reference;
      if (!popoverRef.value || !popperRef) {
        return;
      }
      // Don't hide if target element is contained within popover ref or content
      const target = e.target as Node;
      if (
        elementContains(popoverRef.value, target) ||
        elementContains(popperRef as Node, target)
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
      destroyPopper();
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
      if (!popper) return;
      const popperRef = popper.state.elements.reference;
      if (
        state.autoHide &&
        !state.isFocused &&
        (!popperRef || popperRef !== document.activeElement) &&
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

    function cleanupRO() {
      if (resizeObserver != null) {
        resizeObserver.disconnect();
        resizeObserver = null;
      }
    }

    watch(
      () => popoverRef.value,
      val => {
        cleanupRO();
        if (!val) return;
        resizeObserver = new ResizeObserver(() => {
          if (popper) popper.update();
        });
        resizeObserver.observe(val);
      },
    );

    watch(() => state.placement, updateDirection, {
      immediate: true,
    });

    onMounted(() => {
      addEvents();
    });

    onUnmounted(() => {
      destroyPopper();
      cleanupRO();
      removeEvents();
    });

    return {
      ...toRefs(state),
      popoverRef,
      alignment,
      hide,
      setupPopper,
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
  --popover-horizontal-content-offset: 8px;
  --popover-vertical-content-offset: 10px;
  --popover-caret-horizontal-offset: 18px;
  --popover-caret-vertical-offset: 8px;

  position: absolute;
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
    margin-top: var(--popover-vertical-content-offset);
  }
  &.direction-top {
    margin-bottom: var(--popover-vertical-content-offset);
  }
  &.direction-left {
    margin-right: var(--popover-horizontal-content-offset);
  }
  &.direction-right {
    margin-left: var(--popover-horizontal-content-offset);
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
    left: var(--popover-caret-horizontal-offset);
  }
  &.align-center {
    left: 50%;
  }
  &.align-right {
    right: var(--popover-caret-horizontal-offset);
  }
  &.align-top {
    top: var(--popover-caret-vertical-offset);
  }
  &.align-middle {
    top: 50%;
  }
  &.align-bottom {
    bottom: var(--popover-caret-vertical-offset);
  }
}
</style>
