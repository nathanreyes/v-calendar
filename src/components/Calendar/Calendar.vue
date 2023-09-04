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
          <!--Calendar pages-->
          <CalendarPageProvider
            v-for="page in pages"
            :key="page.id"
            :page="page"
          >
            <CalendarSlot name="page" :page="page">
              <CalendarPage />
            </CalendarSlot>
          </CalendarPageProvider>
        </div>
      </Transition>
      <CalendarSlot name="footer" />
    </div>
  </div>
  <!--Day popover-->
  <CalendarDayPopover />
  <!--Nav popover-->
  <CalendarNavPopover />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { createCalendar, emitsDef, propsDef } from '../../use/calendar';
import CalendarDayPopover from './CalendarDayPopover.vue';
import CalendarHeader from './CalendarHeader.vue';
import CalendarNavPopover from './CalendarNavPopover.vue';
import CalendarPage from './CalendarPage.vue';
import CalendarPageProvider from './CalendarPageProvider.vue';
import CalendarSlot from './CalendarSlot.vue';

export default defineComponent({
  components: {
    CalendarHeader,
    CalendarPage,
    CalendarNavPopover,
    CalendarDayPopover,
    CalendarPageProvider,
    CalendarSlot,
  },
  props: propsDef,
  emit: emitsDef,
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
  top: 0;
  width: 100%;
  pointer-events: none;
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
