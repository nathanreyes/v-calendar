<template>
  <!--Nav panel-->
  <div class="vc-nav-container" ref="navContainer">
    <!--Nav header-->
    <div class="vc-nav-header">
      <!--Move prev button-->
      <span
        role="button"
        class="vc-nav-arrow is-left vc-focus"
        :class="{ 'vc-disabled': !prevItemsEnabled }"
        :tabindex="prevItemsEnabled ? 0 : undefined"
        @click="movePrev"
        @keydown="e => onSpaceOrEnter(e, movePrev)"
      >
        <slot name="nav-left-button">
          <BaseIcon name="ChevronLeft" width="20px" height="24px" />
        </slot>
      </span>
      <!--Mode switch button-->
      <span
        role="button"
        class="vc-nav-title vc-focus"
        :style="{ whiteSpace: 'nowrap' }"
        tabindex="0"
        @click="toggleMode"
        @keydown="e => onSpaceOrEnter(e, toggleMode)"
      >
        {{ title }}
      </span>
      <!--Move next button-->
      <span
        role="button"
        class="vc-nav-arrow is-right"
        :class="{ 'vc-disabled': !nextItemsEnabled }"
        :tabindex="nextItemsEnabled ? 0 : undefined"
        @click="moveNext"
        @keydown="e => onSpaceOrEnter(e, moveNext)"
      >
        <slot name="nav-right-button">
          <BaseIcon name="ChevronRight" width="20px" height="24px" />
        </slot>
      </span>
    </div>
    <!--Navigation items-->
    <div class="vc-nav-items">
      <span
        v-for="item in activeItems"
        :key="item.label"
        role="button"
        :data-id="item.id"
        :aria-label="item.ariaLabel"
        :class="getItemClasses(item)"
        :tabindex="item.isDisabled ? undefined : 0"
        @click="item.click"
        @keydown="e => onSpaceOrEnter(e, item.click)"
      >
        {{ item.label }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseIcon from '../BaseIcon/BaseIcon.vue';
import { createCalendarNav } from '../../use/calendarNav';
import { onSpaceOrEnter } from '../../utils/helpers';
import { propsDef, emitsDef } from '../../use/calendarNav';

const props = defineProps(propsDef);
const emit = defineEmits(emitsDef);

const {
  navContainer,
  title,
  prevItemsEnabled,
  nextItemsEnabled,
  activeItems,
  getItemClasses,
  toggleMode,
  movePrev,
  moveNext,
} = createCalendarNav(props, { emit });
</script>
