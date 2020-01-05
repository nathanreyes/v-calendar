<template>
  <!--Nav panel-->
  <div class="vc-nav-container">
    <!--Nav items-->
    <div class="vc-flex">
      <ul class="vc-nav-list" ref="monthList">
        <li
          v-for="item in monthItems"
          :key="item.id"
          :id="item.id"
          role="button"
          :aria-label="item.ariaLabel"
          :class="getItemClasses(item)"
          :tabindex="item.isDisabled ? undefined : item.isActive ? 0 : -1"
          @click="item.click"
          @keydown="e => onSpaceOrEnter(e, item.click)"
          ref="months"
        >
          {{ item.label }}
        </li>
      </ul>
      <ul class="vc-nav-list" ref="yearList">
        <li
          v-for="item in yearItems"
          :key="item.id"
          :id="item.id"
          role="button"
          :aria-label="item.ariaLabel"
          :class="getItemClasses(item)"
          :tabindex="item.isDisabled ? undefined : item.isActive ? 0 : -1"
          @click="item.click"
          @keydown="e => onSpaceOrEnter(e, item.click)"
          ref="years"
        >
          {{ item.label }}
        </li>
      </ul>
    </div>
    <!--Nav footer-->
    <div class="vc-flex vc-justify-between" :class="theme.navFooter">
      <!--Cancel button-->
      <span
        role="button"
        class="vc-nav-cancel vc-flex vc-justify-center vc-items-center"
        :class="theme.navCancel"
        tabindex="-1"
        @click="onCancelClick"
        @keydown="e => onSpaceOrEnter(e, onCancelClick)"
      >
        <slot name="nav-cancel-button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            class="vc-fill-current vc-w-full vc-h-full"
          >
            <path
              d="M15.78 14.36a1 1 0 0 1-1.42 1.42l-2.82-2.83-2.83 2.83a1 1 0 1 1-1.42-1.42l2.83-2.82L7.3 8.7a1 1 0 0 1 1.42-1.42l2.83 2.83 2.82-2.83a1 1 0 0 1 1.42 1.42l-2.83 2.83 2.83 2.82z"
            />
          </svg>
        </slot>
      </span>
      <!--Shortcuts button-->
      <span
        role="button"
        class="vc-nav-calendar vc-flex vc-justify-center vc-items-center"
        :class="theme.navShortcuts"
        tabindex="-1"
        @click="onShortcutsClick"
        @keydown="e => onSpaceOrEnter(e, onShortcutsClick)"
      >
        <slot name="nav-shortcuts-button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            class="vc-fill-current vc-w-full vc-h-full"
          >
            <path
              class="primary"
              d="M5 4h14a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6c0-1.1.9-2 2-2zm0 5v10h14V9H5z"
            />
            <path
              class="secondary"
              d="M13 13h3v3h-3v-3zM7 2a1 1 0 0 1 1 1v3a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1zm10 0a1 1 0 0 1 1 1v3a1 1 0 0 1-2 0V3a1 1 0 0 1 1-1z"
            />
          </svg>
        </slot>
      </span>
      <!--Submit button-->
      <span
        role="button"
        class="vc-nav-submit vc-flex vc-justify-center vc-items-center"
        :class="theme.navSubmit"
        tabindex="-1"
        @click="onSubmitClick"
        @keydown="e => onSpaceOrEnter(e, onSubmitClick)"
      >
        <slot name="nav-submit-button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            class="vc-fill-current vc-w-full vc-h-full"
          >
            <path
              class="secondary"
              d="M10 14.59l6.3-6.3a1 1 0 0 1 1.4 1.42l-7 7a1 1 0 0 1-1.4 0l-3-3a1 1 0 0 1 1.4-1.42l2.3 2.3z"
            />
          </svg>
        </slot>
      </span>
    </div>
  </div>
</template>

<script>
import Grid from './Grid';
import SvgIcon from './SvgIcon';
import { childMixin } from '@/utils/mixins';
import { pageForDate, onSpaceOrEnter } from '@/utils/helpers';

export default {
  name: 'CalendarNav',
  components: {
    Grid,
    SvgIcon,
  },
  mixins: [childMixin],
  props: {
    value: { type: Object, default: () => ({ month: 0, year: 0 }) },
    validator: { type: Function, default: () => () => true },
  },
  data() {
    return {
      month: 0,
      year: 0,
      hasMounted: false,
      onSpaceOrEnter,
    };
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        if (val) {
          this.month = val.month;
          this.year = val.year;
        }
      },
    },
  },
  computed: {
    title() {
      return `${this.selectedMonthItem.label} ${this.selectedYearItem.label}`;
    },
    monthItems() {
      return this.locale.getMonthDates().map((d, i) => {
        const month = i + 1;
        return {
          month,
          index: i,
          id: `month-${month}`,
          label: this.locale.format(d, this.masks.navMonths),
          ariaLabel: this.locale.format(d, 'MMMM YYYY'),
          isActive: month === this.month,
          isDisabled: !this.validator({ month, year: this.yearIndex }),
          click: () => this.onMonthClick(month),
        };
      });
    },
    yearItems() {
      const startYear = 1900;
      const endYear = 2100;
      const items = [];
      for (let year = startYear, i = 0; year < endYear; year += 1, i++) {
        items.push({
          year,
          index: i,
          id: `year-${year}`,
          label: year,
          ariaLabel: year,
          isActive: year === this.year,
          isDisabled: !this.validator({ month: this.month, year }),
          click: () => this.onYearClick(year),
        });
      }
      return items;
    },
    selectedMonthItem() {
      return this.monthItems.find(i => i.month === this.month);
    },
    selectedYearItem() {
      return this.yearItems.find(i => i.year === this.year);
    },
  },
  mounted() {
    this.scrollToSelected();
    this.hasMounted = true;
  },
  methods: {
    getItemClasses({ isActive, isDisabled }) {
      const classes = [
        this.theme.navCell,
        isActive ? this.theme.navCellActive : this.theme.navCellInactive,
      ];
      if (isActive && this.hasMounted) {
        classes.push('vc-sticky vc-inset-y-0');
      }
      if (isDisabled) {
        classes.push('vc-opacity-25 vc-pointer-events-none');
      }
      return classes;
    },
    onTitleClick() {
      this.scrollToSelected();
    },
    onTitleDblClick() {
      const page = pageForDate(new Date());
      this.month = page.month;
      this.year = page.year;
      this.scrollToSelected();
    },

    onMonthClick(month) {
      this.month = month;
    },
    onYearClick(year) {
      this.year = year;
    },
    onCancelClick() {},
    onShortcutsClick() {},
    onSubmitClick() {
      this.submit();
    },
    submit() {
      this.$emit('input', { month: this.month, year: this.year });
    },
    scrollToSelected() {
      this.scrollToListItem(
        this.$refs.monthList,
        this.$refs.months[this.selectedMonthItem.index],
      );
      this.scrollToListItem(
        this.$refs.yearList,
        this.$refs.years[this.selectedYearItem.index],
      );
    },
    scrollToListItem(list, listItem) {
      list.scrollTop =
        listItem.offsetTop +
        listItem.clientHeight / 2.0 -
        list.clientHeight / 2.0;
    },
  },
};
</script>

<style lang="postcss" scoped>
.vc-nav-list {
  position: relative;
  flex-grow: 1;
  height: 150px;
  padding: 0 10px;
  overflow-y: scroll;
  list-style: none;
  overscroll-behavior-y: none;
}
.vc-nav-calendar {
  margin-right: 1px;
  margin-left: 1px;
}
</style>