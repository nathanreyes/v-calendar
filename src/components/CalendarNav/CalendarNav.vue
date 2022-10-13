<template>
  <!--Nav panel-->
  <div class="vc-nav-container" ref="navContainer">
    <!--Nav header-->
    <div class="vc-nav-header">
      <!--Move prev button-->
      <span
        role="button"
        class="vc-nav-arrow is-left vc-focus"
        :class="{ 'vc-disabled': !prevItemsEnabled }"
        :tabindex="prevItemsEnabled ? 0 : undefined"
        @click="movePrev"
        @keydown="e => onSpaceOrEnter(e, movePrev)"
      >
        <slot name="nav-left-button">
          <BaseIcon name="ChevronLeft" width="20px" height="24px" />
        </slot>
      </span>
      <!--Mode switch button-->
      <span
        role="button"
        class="vc-nav-title vc-focus"
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
        :class="{ 'vc-disabled': !nextItemsEnabled }"
        :tabindex="nextItemsEnabled ? 0 : undefined"
        @click="moveNext"
        @keydown="e => onSpaceOrEnter(e, moveNext)"
      >
        <slot name="nav-right-button">
          <BaseIcon name="ChevronRight" width="20px" height="24px" />
        </slot>
      </span>
    </div>
    <!--Navigation items-->
    <div class="vc-nav-items">
      <span
        v-for="item in activeItems"
        :key="item.label"
        role="button"
        :data-id="item.id"
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

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import BaseIcon from '../BaseIcon/BaseIcon.vue';
import { useCalendar } from '../../use/calendar';
import { onSpaceOrEnter, pad } from '../../utils/helpers';
import { head, last } from '../../utils/_';
import { getMonthDates } from '../../utils/dates';

interface YearItem {
  year: number;
  id: string;
  label: string;
  ariaLabel: string;
  isActive: boolean;
  isCurrent: boolean;
  isDisabled: boolean;
  click: () => void;
}

interface MonthItem extends YearItem {
  month: number;
}

const _yearGroupCount = 12;

const emit = defineEmits(['input']);

const props = defineProps({
  value: { type: Object, default: () => ({ month: 0, year: 0 }) },
});

const monthMode = ref(true);
const yearIndex = ref(0);
const yearGroupIndex = ref(0);
const navContainer = ref<HTMLElement | null>(null);

const { locale, masks, canMove, getPageForDate } = useCalendar();

function focusFirstItem() {
  // Use setTimeout instead of $nextTick so it plays nice with popperjs
  setTimeout(() => {
    if (navContainer.value == null) return;
    // Set focus on the first enabled nav item
    const focusableEl = navContainer.value.querySelector(
      '.vc-nav-item:not(.vc-disabled)',
    ) as HTMLElement;
    if (focusableEl) {
      focusableEl.focus();
    }
  }, 10);
}

function monthClick(month: number, year: number) {
  emit('input', { month, year }, { position: currentPosition.value });
}

function yearClick(year: number) {
  yearIndex.value = year;
  monthMode.value = true;
  focusFirstItem();
}

function getYearItems(yearGroupIndex: number): YearItem[] {
  const { year: thisYear } = getPageForDate(new Date());
  const startYear = yearGroupIndex * _yearGroupCount;
  const endYear = startYear + _yearGroupCount;
  const items = [];
  for (let year = startYear; year < endYear; year += 1) {
    let enabled = false;
    for (let month = 1; month < 12; month++) {
      enabled = canMove({ month, year }, { position: currentPosition.value });
      if (enabled) break;
    }
    items.push({
      year,
      id: year.toString(),
      label: year.toString(),
      ariaLabel: year.toString(),
      isActive: year === currentYear.value,
      isCurrent: year === thisYear,
      isDisabled: !enabled,
      click: () => yearClick(year),
    });
  }
  return items;
}

function getMonthItems(year: number): MonthItem[] {
  const { month: thisMonth, year: thisYear } = getPageForDate(new Date());
  return getMonthDates().map((d, i: number) => {
    const month = i + 1;
    return {
      month,
      year,
      id: `${year}.${pad(month, 2)}`,
      label: locale.value.formatDate(d, masks.value.navMonths),
      ariaLabel: locale.value.formatDate(d, 'MMMM YYYY'),
      isActive: month === currentMonth.value && year === currentYear.value,
      isCurrent: month === thisMonth && year === thisYear,
      isDisabled: !canMove(
        { month, year },
        { position: currentPosition.value },
      ),
      click: () => monthClick(month, year),
    };
  });
}

function getItemClasses({
  isActive,
  isCurrent,
  isDisabled,
}: MonthItem | YearItem) {
  const classes = ['vc-nav-item vc-focus'];
  if (isActive) {
    classes.push('is-active');
  } else if (isCurrent) {
    classes.push('is-current');
  }
  if (isDisabled) {
    classes.push('vc-disabled');
  }
  return classes;
}

function getYearGroupIndex(year: number) {
  return Math.floor(year / _yearGroupCount);
}

function toggleMode() {
  monthMode.value = !monthMode.value;
}

// #region Move methods

function movePrev() {
  if (!prevItemsEnabled.value) return;
  if (monthMode.value) {
    movePrevYear();
  }
  movePrevYearGroup();
}

function moveNext() {
  if (!nextItemsEnabled.value) return;
  if (monthMode.value) {
    moveNextYear();
  }
  moveNextYearGroup();
}

function movePrevYear() {
  yearIndex.value--;
}

function moveNextYear() {
  yearIndex.value++;
}

function movePrevYearGroup() {
  yearGroupIndex.value--;
}

function moveNextYearGroup() {
  yearGroupIndex.value++;
}

// #endregion Move methods

const currentMonth = computed(() => props.value?.month || 0);

const currentYear = computed(() => props.value?.year || 0);

const currentPosition = computed(() => props.value?.position || 1);

const monthItems = computed(() => getMonthItems(yearIndex.value));

const yearItems = computed(() => getYearItems(yearGroupIndex.value));

const firstYear = computed(() => head(yearItems.value.map(i => i.year)));

const lastYear = computed(() => last(yearItems.value.map(i => i.year)));

const title = computed(() => {
  return monthMode.value
    ? yearIndex.value
    : `${firstYear.value} - ${lastYear.value}`;
});

const prevMonthItemsEnabled = computed(() =>
  getMonthItems(yearIndex.value - 1).some(i => !i.isDisabled),
);

const prevYearItemsEnabled = computed(() =>
  getYearItems(yearGroupIndex.value - 1).some(i => !i.isDisabled),
);

const prevItemsEnabled = computed(() =>
  monthMode.value ? prevMonthItemsEnabled.value : prevYearItemsEnabled.value,
);

const nextMonthItemsEnabled = computed(() =>
  getMonthItems(yearIndex.value + 1).some(i => !i.isDisabled),
);

const nextYearItemsEnabled = computed(() =>
  getYearItems(yearGroupIndex.value + 1).some(i => !i.isDisabled),
);

const nextItemsEnabled = computed(() =>
  monthMode.value ? nextMonthItemsEnabled.value : nextYearItemsEnabled.value,
);

const activeItems = computed(() =>
  monthMode.value ? monthItems.value : yearItems.value,
);

watch(
  () => currentYear.value,
  () => {
    yearIndex.value = currentYear.value;
  },
);

watch(
  () => yearIndex.value,
  val => {
    yearGroupIndex.value = getYearGroupIndex(val);
  },
);

yearIndex.value = currentYear.value;

onMounted(() => focusFirstItem());
</script>
