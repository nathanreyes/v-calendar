<template>
  <div
    v-if="weeks.length"
    class="vc-grid-container vc-theme"
    :class="[`vc-${theme.color}`, `vc-grid-${view}`]"
    ref="containerRef"
    @keydown="onKeydown"
  >
    <!--Calendar header-->
    <CalendarHeader :page="page" layout="pnt-u" is-2xl />
    <template v-if="isMonthly">
      <Transition
        :name="`vc-${transitionName}`"
        @before-enter="onTransitionBeforeEnter"
        @after-enter="onTransitionAfterEnter"
      >
        <!--Month grid-->
        <div class="vc-grid-content" @mousedown="onGridMouseDown" ref="gridRef">
          <div
            v-for="(week, i) in weeks"
            :key="week.id"
            class="vc-grid-week"
            :class="[`week-position-${week.weekPosition}`]"
          >
            <!--Weekdays-->
            <div
              v-for="day in week.days"
              :key="day.id"
              class="vc-grid-day"
              :class="[`weekday-${day.weekdayPosition}`]"
            >
              <!--Day header-->
              <div class="vc-grid-day-header">
                <!--Day header label-->
                <div v-if="day.day === 1" class="vc-grid-day-header-month">
                  {{ locale.formatDate(day.date, 'MMM') }}
                </div>
                <div
                  v-if="week.weekPosition === 1"
                  class="vc-grid-day-header-weekday"
                >
                  {{ locale.formatDate(day.date, 'WWW') }}
                </div>
                <!--Day header day-->
                <div>
                  <div
                    tabindex="1"
                    role="button"
                    class="vc-grid-day-header-day-number vc-focusable"
                    @click.stop="onDayNumberClick(day)"
                    @keydown="onDayKeydown(day, $event)"
                    @keydown.space.enter="onDayNumberClick(day)"
                  >
                    {{ day.day }}
                  </div>
                </div>
              </div>
            </div>
            <!--Week events-->
            <div class="vc-grid-week-cells">
              <CalendarCell
                v-for="cell in weekCells[i]"
                :key="cell.key"
                :cell="cell"
              />
            </div>
          </div>
          <!--Cell popover-->
          <CalendarCellPopover ref="cellPopoverRef" />
        </div>
      </Transition>
    </template>
    <template v-else>
      <!--Week header-->
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
      <!--Week grid-->
      <div class="vc-grid">
        <Transition
          :name="`vc-${transitionName}`"
          @before-enter="onTransitionBeforeEnter"
          @after-enter="onTransitionAfterEnter"
        >
          <div class="vc-grid-inset" :key="page.id">
            <div
              class="vc-grid-content"
              :class="{
                'is-resizing': resizing,
                'is-dragging': dragging,
              }"
              @mousedown="onGridMouseDown"
              @touchstart.passive="onGridTouchStart"
              @touchmove.passive="onGridTouchMove"
              @touchend="onGridTouchEnd"
              @keydown.escape="onGridEscapeKeydown"
              ref="gridRef"
            >
              <div class="vc-grid-all-day-content">
                <CalendarCell
                  v-for="cell in allDayCells"
                  :key="cell.key"
                  :cell="cell"
                />
              </div>
              <div class="vc-grid-day-content" :style="gridStyle">
                <!--Grid lines-->
                <div
                  class="vc-grid-layer"
                  style="
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    align-items: stretch;
                  "
                >
                  <svg v-for="n in 25" :key="n" class="vc-grid-line-hour">
                    <line x1="0%" y1="0" x2="100%" y2="0" />
                  </svg>
                </div>
                <!--Hour labels-->
                <div class="vc-grid-layer">
                  <div
                    v-for="cell in labelCells"
                    :key="cell.key"
                    class="vc-grid-label-cell"
                    :style="cell.style"
                  >
                    {{ cell.label }}
                  </div>
                </div>
                <!--Event cells-->
                <div class="vc-grid-layer vc-events-layer">
                  <div
                    v-for="(cells, i) in dayCells"
                    :key="i"
                    class="vc-grid-day"
                  >
                    <CalendarCell
                      v-for="cell in cells"
                      :key="cell.key"
                      :cell="cell"
                    />
                  </div>
                </div>
              </div>
            </div>
            <!--Cell popover-->
            <CalendarCellPopover ref="cellPopoverRef" />
          </div>
        </Transition>
      </div>
    </template>
  </div>
  <!--Nav popover-->
  <CalendarNavPopover />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import CalendarNavPopover from '../CalendarNavPopover/CalendarNavPopover.vue';
import CalendarHeader from '../CalendarHeader/CalendarHeader.vue';
import CalendarCell from '../CalendarCell/CalendarCell.vue';
import CalendarCellPopover from '../CalendarCellPopover/CalendarCellPopover.vue';
import { props } from '../../use/calendar';
import { emits, useCalendarGrid } from '../../use/calendarGrid';

export default defineComponent({
  name: 'CalendarGrid',
  components: {
    CalendarNavPopover,
    CalendarHeader,
    CalendarCell,
    CalendarCellPopover,
  },
  emits,
  props,
  setup(props, { emit }) {
    return useCalendarGrid(props, { emit });
  },
});
</script>

<style lang="css">
@import './calendar-grid.css';
</style>
