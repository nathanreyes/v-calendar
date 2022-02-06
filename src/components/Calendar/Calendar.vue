<template>
  <div
    data-helptext="Press the arrow keys to navigate by day, Home and End to navigate to week ends, PageUp and PageDown to navigate by month, Alt+PageUp and Alt+PageDown to navigate by year"
    v-bind="$attrs"
    :class="[
      'vc-container',
      `vc-${view}`,
      'vc-theme',
      'vc-is-bordered',
      `vc-${theme.color}`,
      {
        'vc-is-expanded': isExpanded,
        'vc-is-dark': theme.isDark,
      },
    ]"
    @keydown="handleKeydown"
    @mouseup.prevent
    ref="containerRef"
  >
    <!--Calendar Container-->
    <div :class="['vc-pane-container', { 'in-transition': inTransition }]">
      <div class="vc-pane-header-wrapper">
        <CalendarHeader :page="firstPage" layout="p-n" is-lg />
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
            gridTemplateColumns: `repeat(${this.columns}, 1fr)`,
          }"
        >
          <!--Calendar Panes-->
          <CalendarPane v-for="page in pages" :key="page.id" :page="page" />
        </div>
      </Transition>
      <slot name="footer" />
    </div>
  </div>
  <!--Nav popover-->
  <CalendarNavPopover />
  <!--Day popover-->
  <CalendarDayPopover
    ><template #default="props"
      ><slot name="day-popover" v-bind="props"/></template
  ></CalendarDayPopover>
</template>

<script>
import { defineComponent } from 'vue';
import CalendarHeader from '../CalendarHeader/CalendarHeader.vue';
import CalendarPane from '../CalendarPane/CalendarPane.vue';
import CalendarNavPopover from '../CalendarNavPopover/CalendarNavPopover.vue';
import CalendarDayPopover from '../CalendarDayPopover/CalendarDayPopover.vue';
import { emits, props, useCalendar } from '../../use/calendar';

export default defineComponent({
  name: 'Calendar',
  components: {
    CalendarHeader,
    CalendarPane,
    CalendarNavPopover,
    CalendarDayPopover,
  },
  emits,
  props,
  setup(props, ctx) {
    return useCalendar(props, ctx);
  },
});
</script>
