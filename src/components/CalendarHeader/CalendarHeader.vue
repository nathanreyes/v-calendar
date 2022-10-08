<template>
  <div
    class="vc-header"
    :class="{ 'is-lg': isLg, 'is-xl': isXl, 'is-2xl': is2xl }"
    :style="gridStyle"
  >
    <div
      v-if="show.prev"
      :class="['vc-arrow', 'vc-prev', { 'vc-disabled': !canMovePrev }]"
      role="button"
      @click="movePrev"
      @keydown.space.enter="movePrev"
    >
      <slot name="header-left-button" :click="movePrev">
        <BaseIcon name="ChevronLeft" />
      </slot>
    </div>
    <div v-if="show.title" class="vc-title" v-popover="navPopoverOptions">
      <slot name="header-title">{{ page.title }}</slot>
    </div>
    <div
      v-if="show.next"
      :class="['vc-arrow', 'vc-next', { 'vc-disabled': !canMoveNext }]"
      role="button"
      @click="moveNext"
      @keydown.space.enter="moveNext"
    >
      <slot name="header-right-button" :click="moveNext">
        <BaseIcon name="ChevronRight" />
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import BaseIcon from '../BaseIcon/BaseIcon.vue';
import { useCalendar } from '../../use/calendar';
import { popoverDirective as vPopover } from '../../utils/popovers';

const props = defineProps({
  page: { type: Object, required: true },
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
@import './calendar-header.css';
</style>
