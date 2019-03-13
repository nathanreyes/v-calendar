<template>
  <div ref="pane" class="vc-pane">
    <!--Header slot-->
    <slot name="header" v-bind="page">
      <div class="vc-header" :class="theme.header">
        <!--Header title-->
        <div :class="['vc-title-layout', titleClass]">
          <div class="vc-title-wrapper">
            <!--Title content-->
            <popover-ref :id="navPopoverId" :visibility="navVisibility_" is-interactive>
              <div class="vc-title" :class="theme.title">
                <slot name="header-title" v-bind="page">{{ page.title }}</slot>
              </div>
            </popover-ref>
            <!--Navigation popover-->
            <popover :id="navPopoverId" :contentClass="theme.navPopoverContainer">
              <!--Navigation pane-->
              <calendar-nav
                :value="page"
                :validator="canMove"
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
    <div class="vc-horizontal-divider" :class="theme.headerDivider" v-if="theme.headerDivider"/>
    <!--Weekday labels-->
    <div class="vc-weekdays">
      <div
        v-for="(weekday, i) in weekdayLabels"
        :key="i + 1"
        class="vc-weekday"
        :class="theme.weekdays"
      >{{ weekday }}</div>
    </div>
    <!--Weekdays horizontal divider-->
    <div class="vc-horizontal-divider" :class="theme.weekdaysDivider" v-if="theme.weekdaysDivider"/>
    <!--Weeks-->
    <calendar-weeks
      class="vc-weeks"
      :page="page"
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
import { childMixin } from '@/utils/mixins';
import { evalFn, createGuid } from '@/utils/helpers';

export default {
  components: {
    CalendarWeeks,
    CalendarNav,
    PopoverRef,
    Popover,
  },
  mixins: [childMixin],
  props: {
    position: { type: Number, default: 1 },
    page: Object,
    minPage: Object,
    maxPage: Object,
    titlePosition: String,
    navVisibility: String,
    canMove: {
      type: Function,
      default: () => true,
    },
  },
  data() {
    return {
      navPopoverId: createGuid(),
    };
  },
  computed: {
    titlePosition_() {
      return this.titlePosition || this.defaults.titlePosition;
    },
    navVisibility_() {
      return this.navVisibility || this.defaults.navVisibility;
    },
    navSlots() {
      return ['nav-left-button', 'nav-right-button'].filter(
        slot => this.$scopedSlots[slot],
      );
    },
    weekdayLabels() {
      return this.locale
        .getWeekdayDates({
          firstDayOfWeek: this.locale.firstDayOfWeek,
        })
        .map(d => this.format(d, this.formats.weekdays));
    },
    titleClass() {
      return this.titlePosition_ ? `align-${this.titlePosition_}` : '';
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
      this.move(pageForThisMonth());
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

.vc-pane
  flex-grow: 1
  flex-shrink: 1
  display: flex
  flex-direction: column
  justify-content: center
  align-items: stretch

.vc-horizontal-divider
  align-self: center

.vc-header
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

.vc-title-layout
  display: flex
  justify-content: center
  align-items: center
  flex-grow: 1

.vc-title-wrapper
  position: relative

.vc-title
  cursor: pointer
  user-select: none
  white-space: nowrap

.vc-weekdays
  flex-shrink: 0
  display: flex
  padding: $weekday-padding

.vc-weekday
  +box()
  flex: 1
  cursor: default
  user-select: none

.vc-weeks
  flex-shrink: 1
  flex-grow: 1
  padding: $weeks-padding

</style>
