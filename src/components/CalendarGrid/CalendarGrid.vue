<template>
  <div
    v-if="weeks.length"
    class="vc-grid-container"
    :class="[`vc-${color}`, `vc-${displayMode}`, `vc-${view}`]"
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
                v-for="week in weeks"
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
import CalendarNavPopover from '../Calendar/CalendarNavPopover.vue';
import CalendarHeader from '../Calendar/CalendarHeader.vue';
import CalendarViewSelect from './CalendarViewSelect.vue';
import CalendarGridWeek from './CalendarGridWeek.vue';
import CalendarDayCell from './CalendarDayCell.vue';
import CalendarCellPopover from './CalendarCellPopover.vue';
import CalendarEventDetails from './CalendarEventDetails.vue';
import { propsDef, emits, createCalendarGrid } from '../../use/calendarGrid';
import type { DateRangeCell } from '../../utils/date/range';
import type { Event } from '../../utils/calendar/event';

const emit = defineEmits(emits);
const props = defineProps(propsDef);
const slots = useSlots();
const {
  containerRef,
  cellPopoverRef,
  dailyGridRef,
  weeklyGridRef,
  color,
  displayMode,
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
} = createCalendarGrid(props, {
  emit,
  slots,
});

const dayCells = computed(() => {
  const result: DateRangeCell<Event>[][] = [];
  days.value.forEach(day => {
    const cells = eventsContext.value.getCells(day);
    result.push(cells.filter(cell => !cell.data.isWeekly));
  });
  return result;
});
</script>

<style lang="css">
.vc-grid-container {
  --width: 1000px;
  --gutter-left: 50px;
  --gutter-right: 16px;
  --gutter-top: 8px;
  --gutter-bottom: 8px;

  --grid-height: 500px;

  width: var(--width);

  .vc-grid-content {
    position: relative;
    overflow: hidden;
    &.is-resizing,
    .is-resizing {
      cursor: ns-resize;
    }
    &.is-dragging,
    .is-dragging {
      cursor: grabbing;
    }
  }

  &.vc-monthly {
    .vc-grid-content {
      margin-top: 0.75rem;
    }
    .vc-grid-week {
      position: relative;
      display: flex;
      border-bottom: 1px solid var(--vc-gray-300);
      &.week-position-1 {
        border-top: 1px solid var(--vc-gray-300);
        .vc-grid-week-cells {
          top: 46px;
        }
      }
    }
    .vc-grid-week-cells {
      position: absolute;
      top: 28px;
      bottom: 14px;
    }
    .vc-grid-day {
      flex-grow: 1;
      height: 125px;
      border-right: 1px solid var(--vc-gray-300);
      &.weekday-1 {
        border-left: 1px solid var(--vc-gray-300);
      }
    }
    .vc-grid-day-header {
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      font-size: var(--vc-text-xs);
      margin: 4px 0;
      .vc-grid-day-header-month {
        position: absolute;
        line-height: 1rem;
        color: var(--vc-gray-500);
        font-weight: var(--vc-font-medium);
        left: 10px;
        top: 3px;
      }
      .vc-grid-day-header-weekday {
        margin-top: 3px;
        line-height: 1rem;
        color: var(--vc-gray-600);
        font-weight: var(--vc-font-medium);
      }
      .vc-grid-day-header-day-number {
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: var(--vc-font-medium);
        width: 24px;
        height: 24px;
        border-radius: var(--vc-rounded-full);
        cursor: pointer;
        user-select: none;
        &:hover {
          background-color: var(--vc-gray-200);
        }
        &:focus {
          outline: 2px solid var(--vc-accent-400) !important;
        }
      }
    }
    .vc-grid-event {
      margin: 0 2px;
    }
  }

  &:not(.vc-monthly) {
    .vc-grid-header-day {
      position: relative;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      flex-grow: 1;
      user-select: none;
      .vc-grid-header-day-label {
        display: flex;
        justify-content: center;
        color: var(--vc-gray-500);
        font-size: 0.75rem;
        font-weight: var(--vc-font-bold);
        line-height: 1rem;
        letter-spacing: 0.025em;
        text-transform: uppercase;
      }
      .vc-grid-header-day-number {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 1.25rem;
        font-weight: 500;
        line-height: 1.75rem;
        margin: 0.25rem 0 0.25rem 0;
        width: 2.25rem;
        height: 2.25rem;
        border-radius: var(--vc-rounded-full);
        cursor: pointer;
        &:hover {
          background-color: var(--vc-gray-200);
        }
        &:focus {
          outline: 2px solid var(--vc-accent-400) !important;
        }
      }
      &.is-today {
        & .vc-grid-header-day-label {
          color: var(--vc-accent-600);
        }
        .vc-grid-header-day-number {
          background-color: var(--vc-accent-100);
          color: var(--vc-accent-600);
        }
      }
      &.is-active {
        .vc-grid-header-day-number {
          background-color: var(--vc-accent-600);
          color: var(--vc-white);
          &:hover {
            background-color: var(--vc-accent-600);
          }
        }
      }
      &.is-inactive {
        opacity: 0.2;
        .vc-grid-header-day-number {
        }
      }
    }
    .vc-grid-day {
      position: relative;
      flex-grow: 1;
      height: 100%;
      margin: 0 2px 0 0;
    }
    .vc-grid-event {
      width: 100%;
    }
  }

  .vc-grid-header-layout {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .vc-grid-header {
    margin-top: 10px;
    z-index: 2;
  }

  .vc-grid-header-days {
    display: flex;
    position: relative;
    border-bottom: 1px solid var(--vc-gray-300);
    padding-left: var(--gutter-left);
    padding-right: var(--gutter-right);
  }

  .vc-grid-header-timezone {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    font-size: var(--vc-text-xs);
    font-weight: var(--vc-font-normal);
    color: var(--vc-gray-500);
    position: absolute;
    left: 0;
    bottom: 0.25rem;
    width: var(--gutter-left);
    height: 100%;
    user-select: none;
  }

  .vc-grid-event {
    position: absolute;
    min-height: 20px;
    cursor: pointer;
    border-radius: 5px;
    border-width: 2px;
    border-style: solid;
    border-color: transparent;
    font-size: var(--vc-text-xs);
    color: var(--vc-gray-700);
    font-weight: var(--vc-font-medium);
    &:hover {
      background-color: var(--vc-accent-100);
    }
    &.is-selected {
      background-color: var(--vc-accent-200);
      border-width: 2px;
    }
    &.is-resizing,
    &.is-dragging {
      pointer-events: none;
    }
    .vc-grid-event-start-date-label,
    .vc-grid-event-date-label {
      color: var(--vc-gray-500);
      user-select: none;
    }
    .vc-grid-event-start-date-label {
      display: none;
    }
    &.is-solid {
      font-weight: var(--vc-font-semibold);
      color: var(--vc-white);
      background-color: var(--vc-accent-600);
      border-color: var(--vc-accent-400);
      &.is-selected,
      &.is-resizing {
        background-color: var(--vc-accent-700);
        border-color: var(--vc-gray-100);
        outline: 2px solid var(--vc-accent-400);
      }
      &:hover {
        background-color: var(--vc-accent-700);
      }
      .vc-grid-event-date-label {
        color: var(--vc-gray-300);
      }
    }
    &.is-light {
      font-weight: var(--vc-font-semibold);
      color: var(--vc-gray-800);
      background-color: var(--vc-accent-100);
      border-color: var(--vc-accent-200);
      &.is-selected,
      &.is-resizing {
        border-color: var(--vc-gray-100);
        outline: 2px solid var(--vc-accent-400);
      }
      &:hover {
        background-color: var(--vc-accent-200);
      }
      .vc-grid-event-date-label {
        color: var(--vc-accent-700);
      }
    }
    * {
      touch-action: none;
    }
    &.is-2xs {
      &.is-selected {
      }
      .vc-grid-event-content {
        padding-top: 0px;
        padding-bottom: 0px;
      }
    }
    &.is-2xs,
    &.is-xs {
      line-height: var(--vc-leading-none);
      .vc-grid-event-start-date-label {
        display: block;
      }
      .vc-grid-event-date-label {
        display: none;
      }
      .vc-grid-event-content {
        display: flex;
        align-items: center;
        > * + * {
          margin-left: 3px;
        }
        .vc-grid-event-summary {
          flex-grow: 1;
        }
      }
    }
    &.is-2xs,
    &.is-xs,
    &.is-sm {
      .vc-grid-event-content {
        overflow-y: hidden;
      }
    }
    &.is-dragging,
    &.is-resizing,
    &.is-selected {
      z-index: 1;
    }
    .vc-grid-event-content-wrapper {
      width: 100%;
      height: 100%;
      position: relative;
    }
    .vc-grid-event-content {
      height: 100%;
      padding: 2px 6px;
      overflow-y: auto;
    }
    .vc-grid-event-indicator {
      width: 8px;
      height: 8px;
      background-color: var(--vc-accent-700);
      border-radius: var(--vc-rounded-full);
      margin-right: 3px;
    }
    .vc-grid-event-summary {
      user-select: none;
      line-height: var(--leading-tight);
    }
    .vc-grid-event-resizer {
      position: absolute;
      &.is-horizontal {
        top: 0px;
        height: 100%;
        width: 7px;
        cursor: ew-resize;
        &.is-start {
          left: -5px;
        }
        &.is-end {
          right: -5px;
        }
      }
      &.is-vertical {
        left: 0px;
        width: 100%;
        height: 7px;
        cursor: ns-resize;
        &.is-start {
          top: -5px;
        }
        &.is-end {
          bottom: -5px;
        }
      }
    }
  }

  .vc-grid-week-cells {
    display: grid;
    grid-auto-rows: max-content;
    grid-auto-flow: row dense;
    width: 100%;
    margin: 2px 0;
    .vc-grid-event {
      position: initial;
      height: 20px;
      margin-top: 2px;
    }
  }

  .vc-grid-layout {
    display: flex;
    .vc-grid-layout-left {
      flex-grow: 1;
    }
    .vc-grid-layout-right {
      flex-shrink: 0;
    }
  }

  .vc-grid-inset {
    padding-left: var(--gutter-left);
    padding-right: 4px;
    padding-top: var(--gutter-top);
    padding-bottom: var(--gutter-bottom);
    height: var(--grid-height);
    overflow-y: auto;
  }

  .vc-grid-day-content {
    position: relative;
  }

  .vc-grid-layer {
    position: absolute;
    width: 100%;
    top: 0px;
    bottom: 0px;
    padding-right: 4px;
    &.vc-grid-hours,
    &.vc-grid-lines {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: stretch;
    }
    &.vc-grid-hours {
      top: -6px;
      bottom: -6px;
    }
  }

  .vc-events-layer {
    display: flex;
    justify-content: stretch;
  }

  .vc-grid-line-hour {
    stroke: var(--vc-gray-300);
    stroke-width: 1px;
    height: 2px;
  }

  .vc-grid-label {
    color: var(--vc-gray-700);
    font-size: var(--vc-text-2xs);
    left: 0px;
    width: var(--gutter-left);
    text-align: right;
    padding-right: 0.5rem;
    transform: translateX(-50px);
    user-select: none;
    &.vc-all-day {
      color: var(--vc-gray-500);
      position: absolute;
      top: -6px;
    }
  }
}
</style>
