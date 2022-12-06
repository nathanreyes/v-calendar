<template>
  <div
    v-if="weeks.length"
    class="vc-grid-container"
    :class="[`vc-${theme.color}`, `vc-${theme.displayMode}`, `vc-${view}`]"
    ref="containerRef"
    @keydown="onKeydown"
  >
    <!--Calendar header-->
    <div class="vc-grid-header-layout">
      <CalendarHeader :page="page" layout="pnt-" is-2xl />
      <CalendarViewSelect />
    </div>
    <div class="vc-grid-layout">
      <div class="vc-grid-layout-left">
        <!--Monthly grid-->
        <template v-if="isMonthly">
          <Transition
            :name="`vc-${transitionName}`"
            @before-enter="onTransitionBeforeEnter"
            @after-enter="onTransitionAfterEnter"
          >
            <div
              class="vc-grid-content"
              :class="{
                'is-resizing': resizing,
                'is-dragging': dragging,
              }"
              @mousedown="onGridMouseDown"
              ref="weeklyGridRef"
            >
              <!--Weeks-->
              <div
                v-for="(week, i) in weeks"
                :key="week.id"
                class="vc-grid-week"
                :class="[`week-position-${week.weekPosition}`]"
              >
                <!--Week headers-->
                <div
                  v-for="day in week.days"
                  :key="day.id"
                  class="vc-grid-day"
                  :class="[`weekday-${day.weekdayPosition}`]"
                >
                  <!--Day header-->
                  <div class="vc-grid-day-header">
                    <!--Day header month label (first day in month)-->
                    <div v-if="day.day === 1" class="vc-grid-day-header-month">
                      {{ locale.formatDate(day.date, 'MMM') }}
                    </div>
                    <!--Day header weekday label (first week in month)-->
                    <div
                      v-if="week.weekPosition === 1"
                      class="vc-grid-day-header-weekday"
                    >
                      {{ locale.formatDate(day.date, 'WWW') }}
                    </div>
                    <!--Day header day (every day)-->
                    <div
                      tabindex="1"
                      role="button"
                      class="vc-grid-day-header-day-number vc-focusable"
                      @mousedown.stop
                      @click.stop="onDayNumberClick(day)"
                      @keydown="onDayKeydown(day, $event)"
                      @keydown.space.enter="onDayNumberClick(day)"
                    >
                      {{ day.day }}
                    </div>
                  </div>
                </div>
                <!--Week events-->
                <CalendarGridWeek :days="week.days" />
              </div>
              <!--Cell popover-->
              <CalendarCellPopover ref="cellPopoverRef" @mousedown.stop />
            </div>
          </Transition>
        </template>
        <!--Weekly/Daily grid-->
        <template v-else>
          <div class="vc-grid-header">
            <div class="vc-grid-header-days">
              <div
                v-if="weeks[0].weeknumberDisplay"
                class="vc-grid-header-timezone"
              >
                {{ weeks[0].weeknumberDisplay }}
              </div>
              <template v-for="day in weeks[0].days" :key="day.id">
                <div
                  class="vc-grid-header-day"
                  :class="{
                    'is-today': day.isToday,
                    'is-active': day.day === page.day,
                    'is-inactive': page.day && day.day !== page.day,
                  }"
                >
                  <div class="vc-grid-header-day-label">
                    {{ locale.formatDate(day.date, 'WWW') }}
                  </div>
                  <span
                    tabindex="1"
                    role="button"
                    class="vc-grid-header-day-number vc-focusable"
                    :class="`id-${day.id}`"
                    @click="onDayNumberClick(day)"
                    @keydown="onDayKeydown(day, $event)"
                    @keydown.space.enter="onDayNumberClick(day)"
                    >{{ day.day }}</span
                  >
                </div>
              </template>
            </div>
          </div>
          <div class="vc-grid-content">
            <Transition
              :name="`vc-${transitionName}`"
              @before-enter="onTransitionBeforeEnter"
              @after-enter="onTransitionAfterEnter"
            >
              <div class="vc-grid-inset" :key="page.id">
                <!--All-day/Multi-day event cells-->
                <div
                  :class="{
                    'is-resizing': resizing,
                    'is-dragging': dragging,
                  }"
                  @mousedown="onGridMouseDown"
                  @touchstart.passive="onGridTouchStart"
                  @touchmove.passive="onGridTouchMove"
                  @touchend="onGridTouchEnd"
                  @keydown.escape="onGridEscapeKeydown"
                  ref="weeklyGridRef"
                >
                  <CalendarGridWeek :days="days" />
                  <div class="vc-grid-label vc-all-day">All-Day</div>
                </div>
                <!--Partial-day event cells-->
                <div
                  :class="{
                    'is-resizing': resizing,
                    'is-dragging': dragging,
                  }"
                  @mousedown="onGridMouseDown($event)"
                  @touchstart.passive="onGridTouchStart($event)"
                  @touchmove.passive="onGridTouchMove"
                  @touchend="onGridTouchEnd"
                  @keydown.escape="onGridEscapeKeydown"
                  ref="dailyGridRef"
                >
                  <div class="vc-grid-day-content" :style="gridStyle">
                    <!--Grid lines-->
                    <div class="vc-grid-layer vc-grid-lines">
                      <svg v-for="n in 25" :key="n" class="vc-grid-line-hour">
                        <line x1="0%" y1="0" x2="100%" y2="0" />
                      </svg>
                    </div>
                    <!--Hour labels-->
                    <div class="vc-grid-layer vc-grid-hours">
                      <div
                        v-for="label in locale.hourLabels"
                        :key="label"
                        class="vc-grid-label"
                      >
                        {{ label }}
                      </div>
                    </div>
                    <!--Daily event cells-->
                    <div class="vc-grid-layer vc-events-layer">
                      <div
                        class="vc-grid-day"
                        v-for="(cells, i) in dayCells"
                        :key="i"
                      >
                        <CalendarDayCell
                          v-for="cell in cells"
                          :key="cell.data.key"
                          :cell="cell"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <!--Cell popover-->
                <CalendarCellPopover ref="cellPopoverRef" @mousedown.prevent />
              </div>
            </Transition>
          </div>
        </template>
      </div>
      <div v-if="isDaily" class="vc-grid-layout-right">
        <CalendarEventDetails :events="selectedEvents" />
      </div>
    </div>
  </div>
  <!--Nav popover-->
  <CalendarNavPopover />
</template>

<script lang="ts">
export default {
  name: 'CalendarGrid',
};
</script>

<script setup lang="ts">
import { useSlots, computed } from 'vue';
import CalendarNavPopover from '../CalendarNavPopover/CalendarNavPopover.vue';
import CalendarHeader from '../CalendarHeader/CalendarHeader.vue';
import CalendarViewSelect from '../CalendarViewSelect/CalendarViewSelect.vue';
import CalendarGridWeek from './CalendarGridWeek.vue';
import CalendarDayCell from './CalendarDayCell.vue';
import CalendarCellPopover from './CalendarCellPopover.vue';
import CalendarEventDetails from '../CalendarEventDetails/CalendarEventDetails.vue';
import {
  CalendarGridProps,
  propsDef,
  emits,
  createCalendarGrid,
} from '../../use/calendarGrid';
import { DateRangeCell } from '../../utils/date/range';
import { Event } from '../../utils/calendar/event';

const emit = defineEmits(emits);
const props = defineProps(propsDef);
const slots = useSlots();
const {
  containerRef,
  cellPopoverRef,
  dailyGridRef,
  weeklyGridRef,
  theme,
  locale,
  isDaily,
  isMonthly,
  gridStyle,
  transitionName,
  resizing,
  dragging,
  page,
  weeks,
  days,
  view,
  eventsContext,
  selectedEvents,
  onKeydown,
  onDayNumberClick,
  onDayKeydown,
  onGridMouseDown,
  onGridTouchStart,
  onGridTouchMove,
  onGridTouchEnd,
  onGridEscapeKeydown,
  onTransitionBeforeEnter,
  onTransitionAfterEnter,
} = createCalendarGrid(props as CalendarGridProps, {
  emit,
  slots,
});

const dayCells = computed(() => {
  const result: DateRangeCell<Event>[][] = [];
  days.value.forEach(({ dayIndex }) => {
    const cells = eventsContext.value.getCells(dayIndex);
    result.push(cells.filter(cell => !cell.data.isWeekly));
  });
  return result;
});
</script>

<style lang="css">
@import './calendar-grid.css';
</style>
