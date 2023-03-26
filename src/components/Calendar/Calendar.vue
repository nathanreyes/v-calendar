<template>
  <div
    data-helptext="Press the arrow keys to navigate by day, Home and End to navigate to week ends, PageUp and PageDown to navigate by month, Alt+PageUp and Alt+PageDown to navigate by year"
    v-bind="$attrs"
    :class="[
      'vc-container',
      `vc-${view}`,
      `vc-${color}`,
      `vc-${displayMode}`,
      {
        'vc-expanded': expanded,
        'vc-bordered': !borderless,
        'vc-transparent': transparent,
      },
    ]"
    @mouseup.prevent
    ref="containerRef"
  >
    <!--Calendar Container-->
    <div :class="['vc-pane-container', { 'in-transition': inTransition }]">
      <div class="vc-pane-header-wrapper">
        <CalendarHeader v-if="firstPage" :page="firstPage!" is-lg hide-title />
      </div>
      <Transition
        :name="`vc-${transitionName}`"
        @before-enter="onTransitionBeforeEnter"
        @after-enter="onTransitionAfterEnter"
      >
        <!--Calendar Layout-->
        <div
          :key="pages[0].id"
          class="vc-pane-layout"
          :style="{
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
          }"
        >
          <!--Calendar Panes-->
          <CalendarPane v-for="page in pages" :key="page.id" :page="page" />
        </div>
      </Transition>
      <slot name="footer" />
    </div>
  </div>
  <!--Day popover-->
  <CalendarDayPopover
    ><template #default="props"
      ><slot name="day-popover" v-bind="props" /></template
  ></CalendarDayPopover>
  <!--Nav popover-->
  <CalendarNavPopover />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import CalendarHeader from '../CalendarHeader/CalendarHeader.vue';
import CalendarPane from '../CalendarPane/CalendarPane.vue';
import CalendarNavPopover from '../CalendarNavPopover/CalendarNavPopover.vue';
import CalendarDayPopover from '../CalendarDayPopover/CalendarDayPopover.vue';
import { emitsDef, propsDef, createCalendar } from '../../use/calendar';

export default defineComponent({
  name: 'Calendar',
  components: {
    CalendarHeader,
    CalendarPane,
    CalendarNavPopover,
    CalendarDayPopover,
  },
  emits: emitsDef,
  props: propsDef,
  setup(props, { emit, slots }) {
    return createCalendar(props, { emit, slots });
  },
});
</script>

<style>
.vc-pane-container {
  width: 100%;
  position: relative;
  &.in-transition {
    overflow: hidden;
  }
}

.vc-pane-layout {
  display: grid;
}

.vc-pane-header-wrapper {
  position: absolute;
  width: 100%;
  pointer-events: none;
}

.vc-arrow {
  grid-row: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  user-select: none;
  pointer-events: auto;
  color: var(--vc-header-arrow-color);
  border-width: 1px;
  border-style: solid;
  border-radius: var(--vc-rounded);
  border-color: transparent;
  width: 28px;
  height: 30px;
  z-index: 1;
  &:hover {
    background: var(--vc-header-arrow-hover-bg);
  }
  &.vc-disabled {
    opacity: 0.25;
    pointer-events: none;
  }
}

.vc-day-popover-container {
  font-size: var(--vc-text-xs);
  font-weight: var(--vc-font-medium);
}

.vc-day-popover-header {
  font-size: var(--vc-text-xs);
  color: var(--vc-day-popover-header-color);
  font-weight: var(--vc-font-semibold);
  text-align: center;
}
</style>
