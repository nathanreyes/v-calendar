<template>
  <!--Nav panel-->
  <div class="vc-nav-container vc-flex vc-flex-col">
    <!--Nav items-->
    <div class="vc-flex-grow">
      <form v-if="isMobile" class="vc-flex">
        <!--Month selector-->
        <select-button
          v-model="month"
          :items="monthItems"
          class="vc-w-1/2"
          focus
        >
          <template v-if="selectedMonthItem" slot-scope="{ hasFocus }">
            <div :class="getItemClasses(selectedMonthItem, hasFocus)">
              {{ selectedMonthItem.label }}
            </div>
          </template>
        </select-button>
        <!--Year selector-->
        <select-button v-model="year" :items="yearItems" class="vc-w-1/2">
          <template v-if="selectedYearItem" slot-scope="{ hasFocus }">
            <div :class="getItemClasses(selectedYearItem, hasFocus)">
              {{ selectedYearItem.label }}
            </div>
          </template>
        </select-button>
      </form>
      <!--Month/Year items-->
      <div v-else class="vc-flex">
        <template v-if="!shortcutsVisible">
          <!--Month list-->
          <ul class="vc-nav-list" ref="monthList">
            <li
              v-for="item in monthItems"
              :key="item.id"
              :id="item.id"
              role="button"
              :aria-label="item.ariaLabel"
              :class="getItemClasses(item)"
              :tabindex="item.isDisabled ? undefined : item.isActive ? 0 : -1"
              @click="item.onClick"
              @keydown="e => onSpaceOrEnter(e, item.click)"
              ref="months"
            >
              {{ item.label }}
            </li>
          </ul>
          <!--Year list-->
          <ul class="vc-nav-list" ref="yearList">
            <li
              v-for="item in yearItems"
              :key="item.id"
              :id="item.id"
              role="button"
              :aria-label="item.ariaLabel"
              :class="getItemClasses(item, false)"
              :tabindex="item.isDisabled ? undefined : item.isActive ? 0 : -1"
              @click="item.onClick"
              @keydown="e => onSpaceOrEnter(e, item.click)"
              ref="years"
            >
              {{ item.label }}
            </li>
          </ul>
        </template>
        <!--Shortcut items-->
        <ul v-else class="vc-nav-list">
          <li
            v-for="item in shortcutItems"
            :key="item.label"
            :id="item.label"
            role="button"
            :class="getItemClasses(item)"
            :tabindex="item.isDisabled ? undefined : item.isActive ? 0 : -1"
            @click="item.onClick"
          >
            {{ item.label }}
          </li>
        </ul>
      </div>
    </div>
    <!--Nav footer-->
    <div :class="theme.navFooter">
      <!--Shortcuts button-->
      <slot name="nav-shortcuts-button">
        <span
          v-if="shortcutItems.length"
          role="button"
          class="vc-nav-shortcuts"
          :class="[theme.navShortcuts, { 'is-mobile': isMobile }]"
          tabindex="0"
          @click="onShortcutsClick"
          @keydown="e => onSpaceOrEnter(e, onShortcutsClick)"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            class="vc-fill-current vc-w-6 vc-h-6"
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
        </span>
      </slot>
      <!--Submit button-->
      <slot name="nav-submit-button">
        <span
          role="button"
          class="vc-nav-submit"
          :class="[theme.navSubmit, { 'is-mobile': isMobile }]"
          tabindex="0"
          @click="onSubmitClick"
          @keydown="e => onSpaceOrEnter(e, onSubmitClick)"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            class="vc-fill-current vc-w-6 vc-h-6"
          >
            <path
              class="secondary"
              d="M10 14.59l6.3-6.3a1 1 0 0 1 1.4 1.42l-7 7a1 1 0 0 1-1.4 0l-3-3a1 1 0 0 1 1.4-1.42l2.3 2.3z"
            />
          </svg>
          <span v-if="!isMobile" class="vc-truncate">{{
            selectedMonthYearLabel
          }}</span>
        </span>
      </slot>
    </div>
  </div>
</template>

<script>
import Grid from './Grid';
import SvgIcon from './SvgIcon';
import SelectButton from './SelectButton';
import { childMixin } from '@/utils/mixins';
import { onSpaceOrEnter } from '@/utils/helpers';
import { isDate, isObject } from '@/utils/_';

export default {
  name: 'CalendarNav',
  components: {
    Grid,
    SvgIcon,
    SelectButton,
  },
  mixins: [childMixin],
  props: {
    value: { type: Object, default: () => ({ month: 0, year: 0 }) },
    shortcuts: { type: Array, default: () => [] },
    validator: { type: Function, default: () => () => true },
  },
  data() {
    return {
      month: 0,
      year: 0,
      hasMounted: false,
      shortcutsVisible: false,
      onSpaceOrEnter,
      isMobile: false,
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
    monthItems() {
      return this.locale.getMonthDates().map((d, i) => {
        const month = i + 1;
        return {
          index: i,
          value: month,
          id: `month-${month}`,
          label: this.locale.format(d, this.masks.navMonths),
          ariaLabel: this.locale.format(d, 'MMMM YYYY'),
          isActive: month === this.month,
          isDisabled: !this.validator({ month, year: this.yearIndex }),
          onClick: () => this.onMonthClick(month),
        };
      });
    },
    yearItems() {
      const startYear = 1900;
      const endYear = 2100;
      const items = [];
      for (let year = startYear, i = 0; year < endYear; year += 1, i++) {
        items.push({
          index: i,
          value: year,
          id: `year-${year}`,
          label: year,
          ariaLabel: year,
          isActive: year === this.year,
          isDisabled: !this.validator({ month: this.month, year }),
          onClick: () => this.onYearClick(year),
        });
      }
      return items;
    },
    shortcutItems() {
      return this.shortcuts
        .map(shortcut => {
          let date = null;
          let page = null;
          let label = '';
          let onClick = null;
          if (isDate(shortcut)) {
            date = shortcut;
            label = label || this.locale.format(date, 'YYYY-MM-DD');
          } else if (isObject(shortcut)) {
            label = shortcut.label;
            if (shortcut.date) {
              date = shortcut.date;
              label = label || this.locale.format(date, 'YYYY-MM-DD');
            } else if (shortcut.month && shortcut.year) {
              page = { month: shortcut.month, year: shortcut.year };
              label =
                label ||
                this.locale.format(new Date(page.year, page.month - 1, 15));
            }
          }
          if (date) {
            onClick = () => this.focus(date);
          } else if (page) {
            onClick = () => this.move(page);
          } else {
            return null;
          }
          return {
            date,
            page,
            label,
            onClick,
          };
        })
        .filter(shortcut => shortcut);
    },
    selectedMonthItem: {
      get() {
        return this.monthItems.find(i => i.value === this.month);
      },
    },
    selectedYearItem: {
      get() {
        return this.yearItems.find(i => i.value === this.year);
      },
    },
    selectedMonthYearLabel() {
      return `${this.selectedMonthItem.label} ${this.selectedYearItem.label}`;
    },
  },
  mounted() {
    if (!this.isMobile) {
      this.scrollToSelectedItems();
    }
    this.hasMounted = true;
  },
  methods: {
    getItemClasses(item, selectFocus) {
      if (!item) return [];
      const { isActive, isDisabled } = item;
      const classes = [this.theme.navCell];
      const active = this.isMobile ? selectFocus : isActive;
      classes.push(
        active ? this.theme.navCellActive : this.theme.navCellInactive,
      );
      if (isDisabled) {
        classes.push('vc-opacity-25 vc-pointer-events-none');
      }
      return classes;
    },
    onMonthClick(month) {
      this.month = month;
    },
    onYearClick(year) {
      this.year = year;
    },
    onShortcutsClick() {
      this.shortcutsVisible = !this.shortcutsVisible;
    },
    onSubmitClick() {
      this.move({ month: this.month, year: this.year });
    },
    move({ month, year }) {
      this.$emit('move', { month, year });
    },
    focus(date) {
      this.$emit('focus', date);
    },
    scrollToSelectedItems() {
      this.scrollToSelectedMonthItem();
      this.scrollToSelectedYearItem();
    },
    scrollToSelectedMonthItem() {
      if (!this.$refs.monthList) return;
      this.scrollToListItem(
        this.$refs.monthList,
        this.$refs.months[this.selectedMonthItem.index],
      );
    },
    scrollToSelectedYearItem() {
      if (!this.$refs.yearList) return;
      this.scrollToListItem(
        this.$refs.yearList,
        this.$refs.years[this.selectedYearItem.index],
      );
    },
    scrollToListItem(list, listItem) {
      if (!list || !listItem) return;
      const scrollTop =
        listItem.offsetTop +
        listItem.clientHeight / 2.0 -
        list.clientHeight / 2.0;
      list.scrollTop = scrollTop;
    },
  },
};
</script>

<style lang="postcss" scoped>
.vc-nav-list {
  flex-grow: 1;
  height: 130px;
  padding: 0 12px;
  list-style: none;
  overflow-y: scroll;
  overscroll-behavior-y: none;
}
.vc-nav-shortcuts {
  margin-right: 1px;
  &.is-mobile {
    flex-grow: 1;
  }
  &:not(.is-mobile) {
    flex-shrink: 1;
  }
}
.vc-nav-submit {
  flex-grow: 1;
}
</style>
