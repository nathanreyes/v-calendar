<template>
  <div
    v-if="weeks.length"
    class="vc-grid-container vc-theme"
    :class="[`vc-${theme.color}`, `vc-${view}`]"
    ref="containerRef"
    @keydown="onKeydown"
  >
    <!--Calendar header-->
    <CalendarHeader :page="page" layout="pnt-u" is-2xl />
    <div class="vc-grid-layout">
      <div class="vc-grid-layout-left">
        <template v-if="isMonthly">
          <Transition
            :name="`vc-${transitionName}`"
            @before-enter="onTransitionBeforeEnter"
            @after-enter="onTransitionAfterEnter"
          >
            <!--Month grid-->
            <div
              class="vc-grid-content"
              @mousedown="onGridMouseDown"
              ref="weeklyGridRef"
            >
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
                    <!--Day header month label (first day)-->
                    <div v-if="day.day === 1" class="vc-grid-day-header-month">
                      {{ locale.formatDate(day.date, 'MMM') }}
                    </div>
                    <!--Day header weekday label-->
                    <div
                      v-if="week.weekPosition === 1"
                      class="vc-grid-day-header-weekday"
                    >
                      {{ locale.formatDate(day.date, 'WWW') }}
                    </div>
                    <!--Day header day-->
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
                <div class="vc-grid-week-cells" :style="weekCellsStyle">
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
          <!--Weekly/Daily header-->
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
          <!--Weekly/Daily grid-->
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
                  ref="weeklyGridRef"
                >
                  <!--All day cells-->
                  <div class="vc-grid-week-cells" :style="weekCellsStyle">
                    <CalendarCell
                      v-for="cell in weekCells[0]"
                      :key="cell.key"
                      :cell="cell"
                    />
                  </div>
                  <div class="vc-grid-label vc-all-day">All-Day</div>
                </div>
                <div
                  class="vc-grid-content"
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
      <div v-if="isDaily" class="vc-grid-layout-right">
        <CalendarCellDetails :cells="selectedCells" />
      </div>
    </div>
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
import CalendarCellDetails from '../CalendarCellDetails/CalendarCellDetails.vue';
import { CalendarProps, props } from '../../use/calendar';
import { emits, useCalendarGrid } from '../../use/calendarGrid';

export default defineComponent({
  name: 'CalendarGrid',
  components: {
    CalendarNavPopover,
    CalendarHeader,
    CalendarCell,
    CalendarCellPopover,
    CalendarCellDetails,
  },
  emits,
  props,
  setup(props, ctx) {
    return useCalendarGrid(props as CalendarProps, ctx);
  },
});
</script>

<style lang="css">
@import './calendar-grid.css';
</style>
