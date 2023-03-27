<template>
  <div
    class="vc-header"
    :class="{ 'is-lg': isLg, 'is-xl': isXl, 'is-2xl': is2xl }"
    :style="gridStyle"
  >
    <slot name="header-left-button" :move="movePrev">
      <button
        v-if="show.prev"
        :class="['vc-arrow vc-prev vc-focus', { 'vc-disabled': !canMovePrev }]"
        role="button"
        type="button"
        @click="movePrev"
        @keydown.space.enter="movePrev"
      >
        <BaseIcon name="ChevronLeft" size="24" />
      </button>
    </slot>
    <div v-if="show.title" class="vc-title" v-popover="navPopoverOptions">
      <slot name="header-title">{{ page.title }}</slot>
    </div>
    <slot name="header-right-button" :move="moveNext">
      <button
        v-if="show.next"
        :class="['vc-arrow vc-next vc-focus', { 'vc-disabled': !canMoveNext }]"
        role="button"
        type="button"
        @click="moveNext"
        @keydown.space.enter="moveNext"
      >
        <BaseIcon name="ChevronRight" size="24" />
      </button>
    </slot>
  </div>
</template>

<script setup lang="ts">
import { PropType, computed } from 'vue';
import BaseIcon from '../BaseIcon/BaseIcon.vue';
import { useCalendar } from '../../use/calendar';
import { popoverDirective as vPopover } from '../../utils/popovers';
import { Page } from '../../utils/page';

const props = defineProps({
  page: { type: Object as PropType<Page>, required: true },
  layout: String,
  isLg: Boolean,
  isXl: Boolean,
  is2xl: Boolean,
  hideTitle: Boolean,
  hideArrows: Boolean,
});

const {
  navPopoverId,
  navVisibility,
  canMovePrev,
  movePrev,
  canMoveNext,
  moveNext,
} = useCalendar();
const navPlacement = computed(() => {
  switch (props.page.titlePosition) {
    case 'left':
      return 'bottom-start';
    case 'right':
      return 'bottom-end';
    default:
      return 'bottom';
  }
});
const navPopoverOptions = computed(() => {
  const { page } = props;
  return {
    id: navPopoverId.value,
    visibility: navVisibility.value,
    placement: navPlacement.value,
    modifiers: [{ name: 'flip', options: { fallbackPlacements: ['bottom'] } }],
    data: { page },
    isInteractive: true,
  };
});
const titleLeft = computed(() => props.page.titlePosition.includes('left'));
const titleRight = computed(() => props.page.titlePosition.includes('right'));
const layout_ = computed(() => {
  if (props.layout) return props.layout;
  if (titleLeft.value) return 'tu-pn';
  if (titleRight.value) return 'pn-tu';
  return 'p-tu-n;';
});
const show = computed(() => {
  return {
    prev: layout_.value.includes('p') && !props.hideArrows,
    title: layout_.value.includes('t') && !props.hideTitle,
    next: layout_.value.includes('n') && !props.hideArrows,
  };
});
const gridStyle = computed(() => {
  const gridTemplateColumns = layout_.value
    .split('')
    .map(l => {
      switch (l) {
        case 'p':
          return '[prev] auto';
        case 'n':
          return '[next] auto';
        case 't':
          return '[title] auto';
        case '-':
          return '1fr';
        default:
          return '';
      }
    })
    .join(' ');
  return { gridTemplateColumns };
});
</script>

<style lang="css">
.vc-header {
  display: grid;
  grid-gap: 4px;
  align-items: center;
  padding: 10px 10px 0px 10px;
  .vc-title {
    grid-row: 1;
    grid-column: title;
    color: var(--vc-header-title-color);
    font-weight: var(--vc-font-semibold);
    cursor: pointer;
    user-select: none;
    white-space: nowrap;
    margin: 0 0.75rem;
    line-height: 30px;
    &:hover {
      opacity: 0.75;
    }
  }
  &.is-lg {
    font-size: var(--vc-text-lg);
  }
  &.is-xl {
    font-size: var(--vc-text-xl);
  }
  &.is-2xl {
    font-size: var(--vc-text-2xl);
  }
  .vc-prev {
    grid-column: prev;
  }
  .vc-next {
    grid-column: next;
  }
}
</style>
