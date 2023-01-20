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

<style lang="css">
.vc-nav-header {
  display: flex;
  justify-content: space-between;
}

.vc-nav-title,
.vc-nav-arrow,
.vc-nav-item {
  font-size: var(--vc-text-sm);
  &:hover {
    background-color: var(--vc-nav-hover-bg);
  }
  &.vc-disabled {
    opacity: 0.25;
    pointer-events: none;
  }
}

.vc-nav-title {
  color: var(--vc-nav-title-color);
  font-weight: var(--vc-font-bold);
  line-height: var(--vc-leading-snug);
  padding: 4px 8px;
  border-radius: var(--vc-rounded);
  border-width: 2px;
  border-style: solid;
  border-color: transparent;
  user-select: none;
}

.vc-nav-arrow {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  user-select: none;
  line-height: var(--vc-leading-snug);
  border-width: 2px;
  border-style: solid;
  border-color: transparent;
  border-radius: var(--vc-rounded);
  &.is-left {
    margin-right: auto;
  }
  &.is-right {
    margin-left: auto;
  }
}

.vc-nav-items {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-row-gap: 2px;
  grid-column-gap: 5px;
}

.vc-nav-item {
  width: 48px;
  text-align: center;
  line-height: var(--vc-leading-snug);
  font-weight: var(--vc-font-semibold);
  padding: 4px 0;
  cursor: pointer;
  border-width: 2px;
  border-style: solid;
  border-color: transparent;
  border-radius: var(--vc-rounded);
  user-select: none;
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
