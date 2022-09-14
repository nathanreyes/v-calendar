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
          :update-layout="setupPopper"
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
  ref,
  toRefs,
  reactive,
  computed,
  watch,
  onMounted,
  onUnmounted,
  defineComponent,
  nextTick,
} from 'vue';
import {
  State as PopperState,
  Instance,
  OptionsGeneric,
  PositioningStrategy,
  createPopper,
} from '@popperjs/core';
import { on, off, elementContains } from '../../utils/helpers';
import { omit } from '../../utils/_';
import {
  PopoverOptions,
  PopoverState,
  PopoverEvent,
} from '../../utils/popovers';

export default defineComponent({
  name: 'Popover',
  inheritAttrs: false,
  emits: ['before-show', 'after-show', 'before-hide', 'after-hide'],
  props: {
    id: { type: String, required: true },
    boundarySelector: { type: String },
  },
  setup(props, { emit }) {
    let timeout: number | undefined = undefined;
    const popoverRef = ref<HTMLElement>();
    let resizeObserver = null;
    let popper: Instance | null = null;

    const state = reactive<PopoverState>({
      isVisible: false,
      refSelector: '',
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
      showDelay: 0,
      hideDelay: 110,
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

    function getRef(selector: string | undefined) {
      if (!selector) return null;
      return document.querySelector(selector);
    }

    function destroyPopper() {
      if (popper) {
        popper.destroy();
        popper = null;
      }
    }

    function setupPopper() {
      nextTick(() => {
        const ref = getRef(state.refSelector);
        if (!ref || !popoverRef.value) return;
        if (popper && popper.state.elements.reference !== ref) {
          destroyPopper();
        }
        if (!popper) {
          popper = createPopper(ref, popoverRef.value, popperOptions.value);
        } else {
          popper.update();
        }
      });
    }

    function updateState(newState: Partial<PopoverState>) {
      Object.assign(state, omit(newState, ['id', 'force']));
    }

    function setTimer(delay: number, fn: Function) {
      clearTimeout(timeout);
      if (delay > 0) {
        timeout = setTimeout(fn, delay);
      } else {
        fn();
      }
    }

    async function show(opts: Partial<PopoverOptions> = {}) {
      if (state.force) return;
      if (opts.force) state.force = true;

      setTimer(opts.showDelay ?? state.showDelay, () => {
        if (state.isVisible) {
          state.force = false;
          emit('after-show');
        }
        updateState({
          ...opts,
          isVisible: true,
        });
        setupPopper();
      });
    }

    function hide(opts: Partial<PopoverOptions> = {}) {
      if (opts.refSelector && opts.refSelector !== state.refSelector) return;
      if (state.force) return;
      if (opts.force) state.force = true;

      setTimer(opts.hideDelay ?? state.hideDelay, () => {
        if (!state.isVisible) state.force = false;
        updateState({
          ...opts,
          isVisible: false,
        });
      });
    }

    function toggle(opts: Partial<PopoverOptions> = {}) {
      const refEl = getRef(opts.refSelector);
      if (state.isVisible && refEl === popper?.state.elements.reference) {
        hide(opts);
      } else {
        show(opts);
      }
    }

    function update(opts: Partial<PopoverOptions> = {}) {
      const ref = getRef(opts.refSelector || state.refSelector);
      if (!popper || !ref) return;
      updateState(opts);
      setupPopper();
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
      hide();
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

    function onDocumentUpdatePopover({ detail }: PopoverEvent) {
      if (!detail.id || detail.id !== props.id) return;
      update(detail);
    }

    function addEvents() {
      on(document, 'keydown', onDocumentKeydown);
      on(document, 'click', onDocumentClick);
      on(document, 'show-popover', onDocumentShowPopover);
      on(document, 'hide-popover', onDocumentHidePopover);
      on(document, 'toggle-popover', onDocumentTogglePopover);
      on(document, 'update-popover', onDocumentUpdatePopover);
    }

    function removeEvents() {
      off(document, 'keydown', onDocumentKeydown);
      off(document, 'click', onDocumentClick);
      off(document, 'show-popover', onDocumentShowPopover);
      off(document, 'hide-popover', onDocumentHidePopover);
      off(document, 'toggle-popover', onDocumentTogglePopover);
      off(document, 'update-popover', onDocumentUpdatePopover);
    }

    function beforeEnter(el: HTMLElement) {
      emit('before-show', el);
    }

    function afterEnter(el: HTMLElement) {
      state.force = false;
      emit('after-show', el);
    }

    function beforeLeave(el: HTMLElement) {
      emit('before-hide', el);
    }

    function afterLeave(el: HTMLElement) {
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

    watch(
      () => popoverRef.value,
      () => {
        if (!popoverRef.value) {
          resizeObserver = null;
          return;
        }
        resizeObserver = new ResizeObserver(() => {
          if (popper) popper.update();
        });
        resizeObserver.observe(popoverRef.value);
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
