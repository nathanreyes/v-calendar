<template>
  <!--Nav panel-->
  <div class="vc-nav-container" ref="navContainer">
    <!--Nav header-->
    <div class="vc-nav-header">
      <!--Move prev button-->
      <button
        type="button"
        class="vc-nav-arrow is-left vc-focus"
        :disabled="!prevItemsEnabled"
        @click="movePrev"
        @keydown="(e: KeyboardEvent) => onSpaceOrEnter(e, movePrev)"
      >
        <CalendarSlot
          name="nav-prev-button"
          :move="movePrev"
          :disabled="!prevItemsEnabled"
        >
          <BaseIcon name="ChevronLeft" width="22px" height="24px" />
        </CalendarSlot>
      </button>
      <!--Mode switch button-->
      <button
        type="button"
        class="vc-nav-title vc-focus"
        @click="toggleMode"
        @keydown="(e: KeyboardEvent) => onSpaceOrEnter(e, toggleMode)"
      >
        {{ title }}
      </button>
      <!--Move next button-->
      <button
        type="button"
        class="vc-nav-arrow is-right vc-focus"
        :disabled="!nextItemsEnabled"
        @click="moveNext"
        @keydown="(e: KeyboardEvent) => onSpaceOrEnter(e, moveNext)"
      >
        <CalendarSlot
          name="nav-next-button"
          :move="moveNext"
          :disabled="!nextItemsEnabled"
        >
          <BaseIcon name="ChevronRight" width="22px" height="24px" />
        </CalendarSlot>
      </button>
    </div>
    <!--Navigation items-->
    <div class="vc-nav-items">
      <button
        v-for="item in activeItems"
        :key="item.label"
        type="button"
        :data-id="item.id"
        :aria-label="item.ariaLabel"
        class="vc-nav-item vc-focus"
        :class="[
          item.isActive ? 'is-active' : item.isCurrent ? 'is-current' : '',
        ]"
        :disabled="item.isDisabled"
        @click="item.click"
        @keydown="(e: KeyboardEvent) => onSpaceOrEnter(e, item.click)"
      >
        {{ item.label }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch, watchEffect } from 'vue';
import { useCalendar } from '../../use/calendar';
import { usePage } from '../../use/page';
import { head, last, onSpaceOrEnter } from '../../utils/helpers';
import BaseIcon from '../BaseIcon/BaseIcon.vue';
import CalendarSlot from './CalendarSlot.vue';

export type IQuerySelector = Pick<HTMLElement, 'querySelector'>;

const { masks, move } = useCalendar();
const { page, getMonthItems, getYearItems } = usePage();

const monthMode = ref(true);
const yearGroupCount = 12;

const selectedYear = ref(page.value.year);
const selectedYearGroup = ref(getYearGroupIndex(page.value.year));
const navContainer = ref<IQuerySelector | null>(null);

function focusFirstItem() {
  // Use setTimeout instead of $nextTick so it plays nice with popperjs
  setTimeout(() => {
    if (navContainer.value == null) return;
    // Set focus on the first enabled nav item
    const focusableEl = navContainer.value.querySelector(
      '.vc-nav-item:not(:disabled)',
    ) as HTMLElement;
    if (focusableEl) {
      focusableEl.focus();
    }
  }, 10);
}

function getYearGroupIndex(year: number) {
  return Math.floor(year / yearGroupCount);
}

function toggleMode() {
  monthMode.value = !monthMode.value;
}

function getStartYear(groupIndex: number) {
  return groupIndex * yearGroupCount;
}

function getEndYear(groupIndex: number) {
  return yearGroupCount * (groupIndex + 1) - 1;
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
  selectedYear.value--;
}

function moveNextYear() {
  selectedYear.value++;
}

function movePrevYearGroup() {
  selectedYearGroup.value--;
}

function moveNextYearGroup() {
  selectedYearGroup.value++;
}

// #endregion Move methods

const monthItems = computed(() =>
  getMonthItems(selectedYear.value, masks.value.navMonths).map(item => ({
    ...item,
    click: () =>
      move(
        { month: item.month, year: item.year },
        { position: page.value.position },
      ),
  })),
);

const prevMonthItems = computed(() =>
  getMonthItems(selectedYear.value - 1, masks.value.navMonths),
);

const prevMonthItemsEnabled = computed(() =>
  prevMonthItems.value.some(i => !i.isDisabled),
);

const nextMonthItems = computed(() =>
  getMonthItems(selectedYear.value + 1, masks.value.navMonths),
);

const nextMonthItemsEnabled = computed(() =>
  nextMonthItems.value.some(i => !i.isDisabled),
);

const yearItems = computed(() =>
  getYearItems(
    getStartYear(selectedYearGroup.value),
    getEndYear(selectedYearGroup.value),
  ).map(item => {
    return {
      ...item,
      click: () => {
        selectedYear.value = item.year;
        monthMode.value = true;
        focusFirstItem();
      },
    };
  }),
);

const prevYearItems = computed(() =>
  getYearItems(
    getStartYear(selectedYearGroup.value - 1),
    getEndYear(selectedYearGroup.value - 1),
  ),
);

const prevYearItemsEnabled = computed(() =>
  prevYearItems.value.some(i => !i.isDisabled),
);

const nextYearItems = computed(() =>
  getYearItems(
    getStartYear(selectedYearGroup.value + 1),
    getEndYear(selectedYearGroup.value + 1),
  ),
);

const nextYearItemsEnabled = computed(() =>
  nextYearItems.value.some(i => !i.isDisabled),
);

const activeItems = computed(() =>
  monthMode.value ? monthItems.value : yearItems.value,
);

const prevItemsEnabled = computed(() =>
  monthMode.value ? prevMonthItemsEnabled.value : prevYearItemsEnabled.value,
);

const nextItemsEnabled = computed(() =>
  monthMode.value ? nextMonthItemsEnabled.value : nextYearItemsEnabled.value,
);

const firstYear = computed(() => head(yearItems.value.map(i => i.year)));

const lastYear = computed(() => last(yearItems.value.map(i => i.year)));

const title = computed(() => {
  return monthMode.value
    ? selectedYear.value
    : `${firstYear.value} - ${lastYear.value}`;
});

watchEffect(() => {
  selectedYear.value = page.value.year;
  focusFirstItem();
});

watch(
  () => selectedYear.value,
  val => (selectedYearGroup.value = getYearGroupIndex(val)),
);

onMounted(() => focusFirstItem());
</script>

<style lang="css">
.vc-nav-header {
  display: flex;
  justify-content: space-between;
}

.vc-nav-title,
.vc-nav-arrow,
.vc-nav-item {
  font-size: var(--vc-text-sm);
  margin: 0;
  cursor: pointer;
  user-select: none;
  border: 0;
  border-radius: var(--vc-rounded);
  white-space: nowrap;
  &:hover {
    background-color: var(--vc-nav-hover-bg);
  }
  &:disabled {
    opacity: 0.25;
    pointer-events: none;
  }
}

.vc-nav-title {
  color: var(--vc-nav-title-color);
  font-weight: var(--vc-font-bold);
  line-height: var(--vc-leading-snug);
  height: 30px;
  padding: 0 6px;
}

.vc-nav-arrow {
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--vc-header-arrow-color);
  width: 26px;
  height: 30px;
  padding: 0;
}

.vc-nav-items {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-row-gap: 2px;
  grid-column-gap: 5px;
  margin-top: 2px;
}

.vc-nav-item {
  width: 48px;
  text-align: center;
  font-weight: var(--vc-font-semibold);
  line-height: var(--vc-leading-snug);
  padding: 6px 0;
  &.is-active {
    color: var(--vc-nav-item-active-color);
    background-color: var(--vc-nav-item-active-bg);
    font-weight: var(--vc-font-bold);
    &:not(:focus) {
      box-shadow: var(--vc-nav-item-active-box-shadow);
    }
  }
  &.is-current {
    color: var(--vc-nav-item-current-color);
  }
}
</style>
