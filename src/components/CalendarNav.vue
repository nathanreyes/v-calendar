<template>
  <!--Nav panel-->
  <div class="vc-nav-container">
    <!--Nav header-->
    <div class="vc-nav-header">
      <!--Move prev button-->
      <span
        role="button"
        class="vc-nav-arrow is-left"
        tabindex="0"
        @click="movePrev"
        @keydown="e => onSpaceOrEnter(e, movePrev)"
      >
        <slot name="nav-left-button">
          <svg-icon name="left-arrow" width="20px" height="24px" />
        </slot>
      </span>
      <!--Mode switch button-->
      <span
        role="button"
        class="vc-nav-title vc-grid-focus"
        :style="{ whiteSpace: 'nowrap' }"
        tabindex="0"
        @click="toggleMode"
        @keydown="e => onSpaceOrEnter(e, toggleMode)"
      >
        {{ title }}
      </span>
      <!--Move next button-->
      <span
        role="button"
        class="vc-nav-arrow is-right"
        tabindex="0"
        @click="moveNext"
        @keydown="e => onSpaceOrEnter(e, moveNext)"
      >
        <slot name="nav-right-button">
          <svg-icon name="right-arrow" width="20px" height="24px" />
        </slot>
      </span>
    </div>
    <!--Navigation items-->
    <div class="vc-nav-items">
      <span
        v-for="item in activeItems"
        :key="item.label"
        role="button"
        :aria-label="item.ariaLabel"
        :class="getItemClasses(item)"
        :tabindex="item.isDisabled ? undefined : 0"
        @click="item.click"
        @keydown="e => onSpaceOrEnter(e, item.click)"
      >
        {{ item.label }}
      </span>
    </div>
  </div>
</template>

<script>
import SvgIcon from './SvgIcon';
import { childMixin } from '../utils/mixins';
import { head, last } from '../utils/_';
import { onSpaceOrEnter } from '../utils/helpers';

const _yearGroupCount = 12;

export default {
  name: 'CalendarNav',
  components: {
    SvgIcon,
  },
  mixins: [childMixin],
  props: {
    value: { type: Object, default: () => ({ month: 0, year: 0 }) },
    validator: { type: Function, default: () => () => true },
  },
  data() {
    return {
      monthMode: true,
      yearIndex: 0,
      yearGroupIndex: 0,
      onSpaceOrEnter,
    };
  },
  computed: {
    month() {
      return this.value ? this.value.month || 0 : 0;
    },
    year() {
      return this.value ? this.value.year || 0 : 0;
    },
    title() {
      return this.monthMode
        ? this.yearIndex
        : `${this.firstYear} - ${this.lastYear}`;
    },
    monthItems() {
      const { month: thisMonth, year: thisYear } = this.pageForDate(new Date());
      return this.locale.getMonthDates().map((d, i) => {
        const month = i + 1;
        return {
          label: this.locale.format(d, this.masks.navMonths),
          ariaLabel: this.locale.format(d, 'MMMM YYYY'),
          isActive: month === this.month && this.yearIndex === this.year,
          isCurrent: month === thisMonth && this.yearIndex === thisYear,
          isDisabled: !this.validator({ month, year: this.yearIndex }),
          click: () => this.monthClick(month),
        };
      });
    },
    yearItems() {
      const { _, year: thisYear } = this.pageForDate(new Date());
      const startYear = this.yearGroupIndex * _yearGroupCount;
      const endYear = startYear + _yearGroupCount;
      const items = [];
      for (let year = startYear; year < endYear; year += 1) {
        items.push({
          year,
          label: year,
          ariaLabel: year,
          isActive: year === this.year,
          isCurrent: year === thisYear,
          isDisabled: !this.validator({ month: this.month, year }),
          click: () => this.yearClick(year),
        });
      }
      return items;
    },
    activeItems() {
      return this.monthMode ? this.monthItems : this.yearItems;
    },
    firstYear() {
      return head(this.yearItems.map(i => i.year));
    },
    lastYear() {
      return last(this.yearItems.map(i => i.year));
    },
  },
  watch: {
    year() {
      this.yearIndex = this.year;
    },
    yearIndex(val) {
      this.yearGroupIndex = this.getYearGroupIndex(val);
    },
  },
  created() {
    this.yearIndex = this.year;
  },
  methods: {
    getItemClasses({ isActive, isCurrent, isDisabled }) {
      const classes = ['vc-nav-item'];
      if (isActive) {
        classes.push('is-active');
      } else if (isCurrent) {
        classes.push('is-current');
      }
      if (isDisabled) {
        classes.push('is-disabled');
      }
      return classes;
    },
    getYearGroupIndex(year) {
      return Math.floor(year / _yearGroupCount);
    },
    monthClick(month) {
      this.$emit('input', { month, year: this.yearIndex });
    },
    yearClick(year) {
      this.yearIndex = year;
      this.monthMode = true;
    },
    toggleMode() {
      this.monthMode = !this.monthMode;
    },
    movePrev() {
      if (this.monthMode) {
        this.movePrevYear();
      }
      this.movePrevYearGroup();
    },
    moveNext() {
      if (this.monthMode) {
        this.moveNextYear();
      }
      this.moveNextYearGroup();
    },
    movePrevYear() {
      this.yearIndex--;
    },
    moveNextYear() {
      this.yearIndex++;
    },
    movePrevYearGroup() {
      this.yearGroupIndex--;
    },
    moveNextYearGroup() {
      this.yearGroupIndex++;
    },
  },
};
</script>

<style lang="postcss">
.vc-nav-header {
  display: flex;
  justify-content: space-between;
}

.vc-nav-arrow {
  display: flex;
  justify-content: center;
  align-items: center;
  line-height: var(--leading-snug);
  border-width: 2px;
  border-style: solid;
  border-color: transparent;
  border-radius: var(--rounded);
  &.is-left {
    margin-right: auto;
  }
  &.is-right {
    margin-left: auto;
  }
  &:hover {
    background-color: var(--gray-900);
  }
  &:focus {
    border-color: var(--accent-600);
  }
}

.vc-nav-title {
  color: var(--accent-100);
  font-weight: var(--font-bold);
  line-height: var(--leading-snug);
  padding: 4px 8px;
  border-radius: var(--rounded);
  border-width: 2px;
  border-style: solid;
  border-color: transparent;
  user-select: none;
  &:hover {
    background-color: var(--gray-900);
  }
  &:focus {
    border-color: var(--accent-600);
  }
}

.vc-nav-items {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-row-gap: 2px;
  grid-column-gap: 5px;
}

.vc-nav-item {
  width: 48px;
  text-align: center;
  line-height: var(--leading-snug);
  font-weight: var(--font-semibold);
  padding: 4px 0;
  cursor: pointer;
  border-color: transparent;
  border-width: 2px;
  border-style: solid;
  border-radius: var(--rounded);
  user-select: none;
  &:hover {
    color: var(--white);
    background-color: var(--gray-900);
    box-shadow: var(--shadow-inner);
  }
  &:focus {
    border-color: var(--accent-600);
  }
  &.is-active {
    color: var(--accent-900);
    background: var(--accent-100);
    font-weight: var(--font-bold);
    box-shadow: var(--shadow);
  }
  &:is-current {
    color: var(--accent-100);
    font-weight: var(--bold);
    border-color: var(--accent-100);
  }
  &.is-disabled {
    opacity: 0.25;
    pointer-events: none;
  }
}

.vc-is-dark {
  & .vc-nav-title {
    color: var(--gray-900);
    &:hover {
      background-color: var(--gray-200);
    }
    &:focus {
      border-color: var(--accent-400);
    }
  }
  & .vc-nav-arrow {
    &:hover {
      background-color: var(--gray-200);
    }
    &:focus {
      border-color: var(--accent-400);
    }
  }
  & .vc-nav-item {
    &:hover {
      color: var(--gray-900);
      background-color: var(--gray-200);
      box-shadow: none;
    }
    &:focus {
      border-color: var(--accent-400);
    }
    &.is-active {
      color: var(--white);
      background: var(--accent-500);
    }
    &.is-current {
      color: var(--accent-600);
      border-color: var(--accent-500);
    }
  }
}
</style>
