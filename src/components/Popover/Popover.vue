<template>
  <!-- <Teleport :to="teleportTo"> -->
  <div
    class="vc-popover-content-wrapper"
    :class="{ 'is-interactive': isInteractive }"
    ref="popoverRef"
    teleport-to=".vc-grid-content"
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
        :class="['vc-popover-content vc-theme', `direction-${direction}`]"
        :style="contentStyle"
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
  <!-- </Teleport> -->
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
  State,
  Instance,
  Placement,
  OptionsGeneric,
  PositioningStrategy,
  createPopper,
} from '@popperjs/core';
import { on, off, elementContains } from '../../utils/helpers';
import { omit } from '../../utils/_';
import {
  PopoverOptions,
  PopoverVisibility,
  PopoverEvent,
} from '../../utils/popovers';

interface PopoverState {
  isVisible: boolean;
  refSelector: string;
  opts: PopoverOptions | null;
  data: any;
  transition: string;
  transitionTranslate: string;
  transitionDuration: string;
  placement: Placement;
  positionFixed: false;
  modifiers: any[];
  isInteractive: boolean;
  visibility: PopoverVisibility;
  isHovered: boolean;
  isFocused: boolean;
  showDelay: number;
  hideDelay: number;
  autoHide: boolean;
  showing: boolean;
  hiding: boolean;
}

export default defineComponent({
  name: 'Popover',
  inheritAttrs: false,
  emits: ['before-show', 'after-show', 'before-hide', 'after-hide'],
  props: {
    id: { type: String, required: true },
    teleportTo: { type: String, default: '' },
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
      opts: null,
      data: null,
      transition: 'slide-fade',
      transitionTranslate: '15px',
      transitionDuration: '0.15s',
      placement: 'bottom',
      positionFixed: false,
      modifiers: [],
      isInteractive: true,
      visibility: 'click',
      isHovered: false,
      isFocused: false,
      showDelay: 0,
      hideDelay: 110,
      autoHide: false,
      showing: false,
      hiding: false,
    });

    function onPopperUpdate(popperState: Partial<State>) {
      if (popperState.placement) state.placement = popperState.placement;
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

    function destroyPopper() {
      if (popper) {
        popper.destroy();
        popper = null;
      }
    }

    const contentStyle = computed(() => {
      return {
        '--slide-translate': state.transitionTranslate,
        '--slide-duration': state.transitionDuration,
      };
    });

    const direction = computed(() => {
      return (state.placement && state.placement.split('-')[0]) || 'bottom';
    });

    const alignment = computed(() => {
      const isLeftRight =
        direction.value === 'left' || direction.value === 'right';
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

    function clearState() {
      state.showing = false;
      state.hiding = false;
      clearTimeout(timeout);
    }

    function show(opts: Partial<PopoverOptions> = {}) {
      clearState();
      state.showing = true;
      const doShow = () => {
        clearState();
        Object.assign(state, omit(opts, ['id']), { isVisible: true });
        setupPopper();
      };
      const { showDelay = state.showDelay } = opts;
      if (showDelay > 0) {
        timeout = setTimeout(() => doShow(), showDelay);
      } else {
        doShow();
      }
    }

    function hide(opts: Partial<PopoverOptions> = {}) {
      if (state.showing || state.hiding) return;
      if (!opts.refSelector && state.showing) return;
      if (opts.refSelector && opts.refSelector !== state.refSelector) return;
      const doHide = () => {
        clearState();
        Object.assign(state, omit(opts, ['id']), { isVisible: false });
      };
      clearState();
      state.hiding = true;
      const { hideDelay = state.hideDelay } = opts;
      if (hideDelay > 0) {
        timeout = setTimeout(doHide, hideDelay);
      } else {
        doHide();
      }
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
      Object.assign(state, omit(opts, ['id']));
      setupPopper();
    }

    function onDocumentClick(e: CustomEvent) {
      if (!popper) return;
      const popperRef = popper.state.elements.reference;
      if (!popoverRef.value || !popperRef) {
        return;
      }
      // Don't hide if target element is contained within popover ref or content
      const { target } = e.detail;
      if (
        elementContains(popoverRef.value, target as Node) ||
        elementContains(popperRef as Node, target as Node)
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
      on(document, 'click-no-move', onDocumentClick);
      on(document, 'show-popover', onDocumentShowPopover);
      on(document, 'hide-popover', onDocumentHidePopover);
      on(document, 'toggle-popover', onDocumentTogglePopover);
      on(document, 'update-popover', onDocumentUpdatePopover);
    }

    function removeEvents() {
      off(document, 'keydown', onDocumentKeydown);
      off(document, 'click-no-move', onDocumentClick);
      off(document, 'show-popover', onDocumentShowPopover);
      off(document, 'hide-popover', onDocumentHidePopover);
      off(document, 'toggle-popover', onDocumentTogglePopover);
      off(document, 'update-popover', onDocumentUpdatePopover);
    }

    function beforeEnter(el: HTMLElement) {
      emit('before-show', el);
    }

    function afterEnter(el: HTMLElement) {
      emit('after-show', el);
    }

    function beforeLeave(el: HTMLElement) {
      emit('before-hide', el);
    }

    function afterLeave(el: HTMLElement) {
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
      contentStyle,
      direction,
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
@import './popover.css';
</style>
