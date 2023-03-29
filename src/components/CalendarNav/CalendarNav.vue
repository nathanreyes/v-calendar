<template>
  <!--Nav panel-->
  <div class="vc-nav-container" ref="navContainer">
    <!--Nav header-->
    <div class="vc-nav-header">
      <!--Move prev button-->
      <button
        type="button"
        class="vc-nav-arrow is-left vc-focus"
        :disabled="!prevItemsEnabled"
        @click="movePrev"
        @keydown="e => onSpaceOrEnter(e, movePrev)"
      >
        <CalendarSlot
          name="nav-prev-button"
          :move="movePrev"
          :disabled="!prevItemsEnabled"
        >
          <BaseIcon name="ChevronLeft" width="22px" height="24px" />
        </CalendarSlot>
      </button>
      <!--Mode switch button-->
      <button
        type="button"
        class="vc-nav-title vc-focus"
        @click="toggleMode"
        @keydown="e => onSpaceOrEnter(e, toggleMode)"
      >
        {{ title }}
      </button>
      <!--Move next button-->
      <button
        type="button"
        class="vc-nav-arrow is-right vc-focus"
        :disabled="!nextItemsEnabled"
        @click="moveNext"
        @keydown="e => onSpaceOrEnter(e, moveNext)"
      >
        <CalendarSlot
          name="nav-next-button"
          :move="moveNext"
          :disabled="!nextItemsEnabled"
        >
          <BaseIcon name="ChevronRight" width="22px" height="24px" />
        </CalendarSlot>
      </button>
    </div>
    <!--Navigation items-->
    <div class="vc-nav-items">
      <button
        v-for="item in activeItems"
        :key="item.label"
        type="button"
        :data-id="item.id"
        :aria-label="item.ariaLabel"
        class="vc-nav-item vc-focus"
        :class="[
          item.isActive ? 'is-active' : item.isCurrent ? 'is-current' : '',
        ]"
        :disabled="item.isDisabled"
        @click="item.click"
        @keydown="e => onSpaceOrEnter(e, item.click)"
      >
        {{ item.label }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseIcon from '../BaseIcon/BaseIcon.vue';
import CalendarSlot from '../CalendarSlot/CalendarSlot.vue';
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
  toggleMode,
  movePrev,
  moveNext,
} = createCalendarNav(props, { emit });
</script>

<style lang="css">
.vc-nav-header {
  display: flex;
  justify-content: space-between;
}

.vc-nav-title,
.vc-nav-arrow,
.vc-nav-item {
  font-size: var(--vc-text-sm);
  margin: 0;
  cursor: pointer;
  user-select: none;
  border: 0;
  border-radius: var(--vc-rounded);
  white-space: nowrap;
  &:hover {
    background-color: var(--vc-nav-hover-bg);
  }
  &:disabled {
    opacity: 0.25;
    pointer-events: none;
  }
}

.vc-nav-title {
  color: var(--vc-nav-title-color);
  font-weight: var(--vc-font-bold);
  line-height: var(--vc-leading-snug);
  height: 30px;
  padding: 0 6px;
}

.vc-nav-arrow {
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--vc-header-arrow-color);
  width: 26px;
  height: 30px;
  padding: 0;
}

.vc-nav-items {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-row-gap: 2px;
  grid-column-gap: 5px;
  margin-top: 2px;
}

.vc-nav-item {
  width: 48px;
  text-align: center;
  font-weight: var(--vc-font-semibold);
  line-height: var(--vc-leading-snug);
  padding: 6px 0;
  &.is-active {
    color: var(--vc-nav-item-active-color);
    background-color: var(--vc-nav-item-active-bg);
    font-weight: var(--vc-font-bold);
    &:not(:focus) {
      box-shadow: var(--vc-nav-item-active-box-shadow);
    }
  }
  &.is-current {
    color: var(--vc-nav-item-current-color);
  }
}
</style>
