<template>
  <div ref="pane" class="c-pane" :style="paneStyle">
    <!--Header slot-->
    <slot name="header" v-bind="page">
      <div class="c-header" :style="headerStyle">
        <!--Header title-->
        <div :class="['c-title-layout', titleClass]">
          <div class="c-title-wrapper">
            <!--Title content-->
            <popover-ref :id="navPopoverId" :visibility="navVisibility" is-interactive>
              <div class="c-title" :style="titleStyle">
                <slot name="header-title" v-bind="page">{{ page.title }}</slot>
              </div>
            </popover-ref>
            <!--Navigation popover-->
            <popover :id="navPopoverId">
              <!--Navigation pane-->
              <calendar-nav
                :value="page"
                :validator="canMove"
                :styles="styles"
                :formats="formats"
                @input="navPageSelected($event)"
              >
                <!--Pass through nav slots-->
                <template v-for="slot in navSlots" :slot="slot" slot-scope="props">
                  <slot :name="slot" v-bind="props"></slot>
                </template>
              </calendar-nav>
            </popover>
          </div>
        </div>
      </div>
    </slot>
    <!--Header horizontal divider-->
    <div
      class="c-horizontal-divider"
      :style="headerHorizontalDividerStyle_"
      v-if="headerHorizontalDividerStyle_"
    ></div>
    <!--Weekday labels-->
    <div class="c-weekdays" :style="weekdaysStyle_">
      <div v-for="(weekday, i) in weekdayLabels" :key="i + 1" class="c-weekday">{{ weekday }}</div>
    </div>
    <!--Weekdays horizontal divider-->
    <div
      class="c-horizontal-divider"
      :style="weekdaysHorizontalDividerStyle_"
      v-if="weekdaysHorizontalDividerStyle_"
    ></div>
    <!--Weeks-->
    <calendar-weeks
      class="c-weeks"
      :style="weeksStyle_"
      :page="page"
      :styles="styles"
      :formats="formats"
      v-bind="$attrs"
      v-on="$listeners"
    >
      <template v-for="slot in Object.keys($scopedSlots)" :slot="slot" slot-scope="props">
        <slot :name="slot" v-bind="props"></slot>
      </template>
    </calendar-weeks>
  </div>
</template>

<script>
import Popover from './Popover';
import PopoverRef from './PopoverRef';
import CalendarWeeks from './CalendarWeeks';
import CalendarNav from './CalendarNav';
import defaults from '@/utils/defaults';
import { getWeekdayDates, evalFn, createGuid } from '@/utils/helpers';
import { format } from '@/utils/fecha';
import { todayComps } from '../utils/helpers';

export default {
  components: {
    CalendarWeeks,
    CalendarNav,
    PopoverRef,
    Popover,
  },
  props: {
    position: { type: Number, default: 1 },
    page: Object,
    minPage: Object,
    maxPage: Object,
    styles: { type: Object, default: () => {} },
    formats: Object,
    titlePosition: { type: String, default: () => defaults.titlePosition },
    navVisibility: { type: String, default: () => defaults.navVisibility },
    canMove: {
      type: Function,
      default: () => true,
    },
  },
  data() {
    return {
      todayComps,
      navPopoverId: createGuid(),
    };
  },
  computed: {
    navSlots() {
      return ['nav-left-button', 'nav-right-button'].filter(
        slot => this.$scopedSlots[slot],
      );
    },
    weekdayLabels() {
      return getWeekdayDates({ firstDayOfWeek: defaults.firstDayOfWeek }).map(
        d => format(d, this.formats.weekdays),
      );
    },
    titleClass() {
      return this.titlePosition ? `align-${this.titlePosition}` : '';
    },
    paneStyle() {
      return evalFn(this.styles.pane, this.page);
    },
    headerStyle() {
      return evalFn(this.styles.header, this.page);
    },
    titleStyle() {
      return evalFn(this.styles.headerTitle, this.page);
    },
    arrowStyle() {
      return evalFn(this.styles.headerArrows, this.page);
    },
    headerHorizontalDividerStyle_() {
      return evalFn(this.styles.headerHorizontalDivider, this.page);
    },
    weekdaysStyle_() {
      return evalFn(this.styles.weekdays, this.page);
    },
    weekdaysHorizontalDividerStyle_() {
      return evalFn(this.styles.weekdaysHorizontalDivider, this.page);
    },
    weeksStyle_() {
      return {
        ...evalFn(this.styles.weeks, this.page),
      };
    },
    navWrapperStyle() {
      return {
        ...evalFn(this.styles.navWrapper, this.page),
      };
    },
    canMovePrevMonth() {
      return this.canMove(this.page.prevMonthComps);
    },
    canMoveNextMonth() {
      return this.canMove(this.page.nextMonthComps);
    },
  },
  methods: {
    navPageSelected(page) {
      this.move(page);
    },
    monthIsDisabled(month) {
      if (this.minPage && this.yearNumber === this.minPage.year)
        return month < this.minPage.month;
      if (this.maxPage && this.yearNumber === this.maxPage.year)
        return month > this.maxPage.month;
      return false;
    },
    yearIsDisabled(year) {
      if (this.minPage && year < this.minPage.year) return true;
      if (this.maxPage && year > this.maxPage.year) return true;
      return false;
    },
    movePrevYear() {
      this.move({ month: this.page_.month, year: this.page_.year - 1 });
    },
    movePrevMonth() {
      this.move(this.page_.prevMonthComps);
    },
    moveThisMonth() {
      this.move(todayComps);
    },
    moveNextMonth() {
      this.move(this.page_.nextMonthComps);
    },
    moveNextYear() {
      this.move({ month: this.page_.month, year: this.page_.year + 1 });
    },
    move(pageInfo) {
      this.$emit('update:page', pageInfo);
    },
  },
};
</script>

<style lang='sass' scoped>

@import '../styles/vars.sass'
@import '../styles/mixins.sass'

.c-pane
  flex-grow: 1
  flex-shrink: 1
  display: flex
  flex-direction: column
  justify-content: center
  align-items: stretch

.c-horizontal-divider
  align-self: center

.c-header
  flex-shrink: 0
  display: flex
  align-items: stretch
  user-select: none
  padding: $header-padding
  &.align-left
    order: -1
    justify-content: flex-start
  &.align-right
    order: 1
    justify-content: flex-end

.c-title-layout
  display: flex
  justify-content: center
  align-items: center
  flex-grow: 1

.c-title-wrapper
  position: relative

.c-title
  font-weight: $title-font-weight
  font-size: $title-font-size
  cursor: pointer
  user-select: none
  white-space: nowrap

.c-weekdays
  flex-shrink: 0
  display: flex
  padding: $weekday-padding
  color: $weekday-color
  font-size: $weekday-font-size
  font-weight: $weekday-font-weight

.c-weekday
  +box()
  flex: 1
  cursor: default
  user-select: none

.c-weeks
  flex-shrink: 1
  flex-grow: 1
  padding: $weeks-padding

</style>
