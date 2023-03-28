<template>
  <div
    class="vc-header"
    :class="{ 'is-lg': isLg, 'is-xl': isXl, 'is-2xl': is2xl }"
    :style="gridStyle"
  >
    <button
      v-if="show.prev"
      type="button"
      :class="[
        'vc-arrow vc-prev vc-focus',
        {
          'vc-disabled': !canMovePrev,
        },
      ]"
      @click="movePrev"
      @keydown.space.enter="movePrev"
    >
      <CalendarSlot name="header-prev-button" :disabled="!canMovePrev">
        <BaseIcon name="ChevronLeft" size="24" />
      </CalendarSlot>
    </button>
    <div v-if="show.title" class="vc-title" v-popover="navPopoverOptions">
      <CalendarSlot name="header-title" :title="page.title">
        <span>{{ page.title }}</span>
      </CalendarSlot>
    </div>
    <button
      v-if="show.next"
      type="button"
      :class="[
        'vc-arrow vc-next vc-focus',
        {
          'vc-disabled': !canMoveNext,
        },
      ]"
      @click="moveNext"
      @keydown.space.enter="moveNext"
    >
      <CalendarSlot name="header-next-button" :disabled="!canMoveNext">
        <BaseIcon name="ChevronRight" size="24" />
      </CalendarSlot>
    </button>
  </div>
</template>

<script setup lang="ts">
import { PropType, computed } from 'vue';
import BaseIcon from '../BaseIcon/BaseIcon.vue';
import CalendarSlot from '../CalendarSlot/CalendarSlot.vue';
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
  height: 30px;
  margin-top: 10px;
  padding-left: 10px;
  padding-right: 10px;

  &.is-lg {
    font-size: var(--vc-text-lg);
  }
  &.is-xl {
    font-size: var(--vc-text-xl);
  }
  &.is-2xl {
    font-size: var(--vc-text-2xl);
  }

  .vc-title,
  .vc-prev,
  .vc-next {
    display: flex;
    align-items: center;
    grid-row: 1;
    pointer-events: auto;
  }

  .vc-title {
    grid-column: title;
    color: var(--vc-header-title-color);
    font-weight: var(--vc-font-semibold);
    cursor: pointer;
    user-select: none;
    white-space: nowrap;
    margin: 0 8px;
    line-height: 30px;
    &:hover {
      opacity: 0.75;
    }
  }
  .vc-prev {
    grid-column: prev;
  }
  .vc-next {
    grid-column: next;
  }
}
</style>
