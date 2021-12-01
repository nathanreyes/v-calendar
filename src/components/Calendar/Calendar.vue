<template>
  <!--Nav Popover-->
  <Popover
    :id="navPopoverId"
    :class="[
      'vc-nav-popover-container',
      'vc-theme',
      `vc-${theme.color}`,
      { 'vc-is-dark': theme.isDark },
    ]"
    ref="navPopoverRef"
  >
    <template #default="{ data }">
      <CalendarNav
        :value="data.page"
        :validator="e => this.canMove(e, { position: data.page.position })"
        @input="move"
      />
    </template>
  </Popover>
  <slot v-if="pages.length">
    <div
      data-helptext="Press the arrow keys to navigate by day, Home and End to navigate to week ends, PageUp and PageDown to navigate by month, Alt+PageUp and Alt+PageDown to navigate by year"
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
        <Transition
          :name="`vc-${transitionName}`"
          @before-enter="onTransitionBeforeEnter"
          @after-enter="onTransitionAfterEnter"
        >
          <div
            :key="pages[0].id"
            class="vc-pane-layout"
            :style="{
              gridTemplateColumns: `repeat(${this.columns}, 1fr)`,
            }"
          >
            <CalendarPane
              v-for="page in pages"
              :key="page.id"
              v-bind="{ page }"
            />
          </div>
        </Transition>
        <slot name="footer" />
      </div>
    </div>
  </slot>
</template>

<script>
import Popover from '../Popover/Popover.vue';
import CalendarNav from '../CalendarNav/CalendarNav.vue';
import CalendarPane from '../CalendarPane/CalendarPane.vue';
import { getDefault } from '../../utils/defaults';
import { useCalendar, emits } from '../../utils/calendar';

export default {
  name: 'CalendarTest',
  emits,
  components: { Popover, CalendarNav, CalendarPane },
  props: {
    color: {
      type: String,
      default: getDefault('color'),
    },
    isDark: {
      type: Boolean,
      default: getDefault('isDark'),
    },

    view: {
      type: String,
      default: 'monthly',
      validator(value) {
        return ['daily', 'weekly', 'monthly'].includes(value);
      },
    },
    rows: {
      type: Number,
      default: 1,
    },
    columns: {
      type: Number,
      default: 1,
    },
    step: Number,
    titlePosition: {
      type: String,
      default: getDefault('titlePosition'),
    },
    navVisibility: {
      type: String,
      default: getDefault('navVisibility'),
    },
    isExpanded: Boolean,
    minPage: Object,
    maxPage: Object,
    transition: String,
    attributes: [Object, Array],
    trimWeeks: Boolean,
    firstDayOfWeek: Number,
    masks: Object,
    locale: [String, Object],
    timezone: String,
    minDate: null,
    maxDate: null,
    minDateExact: null,
    maxDateExact: null,
    disabledDates: null,
    availableDates: null,
    disablePageSwipe: Boolean,
  },
  setup(props, ctx) {
    return useCalendar(props, ctx);
  },
};
</script>

<style lang="css">
@import '../Calendar/calendar.css';
</style>
