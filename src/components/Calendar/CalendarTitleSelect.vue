<template>
  <div class="vc-title-select-nav">
    <BaseSelect v-model="value" :options="monthOptions" fit-content />
    <BaseSelect v-model="value" :options="yearOptions" fit-content />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useCalendar } from '../../use/calendar';
import { usePage } from '../../use/page';
import { getPageId } from '../../utils/page';
import BaseSelect from '../BaseSelect/BaseSelect.vue';

const props = defineProps({
  monthFormat: { type: String, default: 'MMMM' },
});

const { move, minPage, maxPage } = useCalendar();
const { page, getMonthItems, getYearItems } = usePage();

const value = ref(getPageId(page.value.month, page.value.year));

const defaultMinYear = 1900;
const defaultMaxYear = 2100;

const minYear = computed(() => {
  if (minPage.value != null) return minPage.value.year;
  if (maxPage.value != null) return maxPage.value.year - 200;
  return defaultMinYear;
});

const maxYear = computed(() => {
  if (maxPage.value != null) return maxPage.value.year;
  if (minPage.value != null) return minPage.value.year + 200;
  return defaultMaxYear;
});

const monthItems = computed(() =>
  getMonthItems(page.value.year, props.monthFormat),
);
const monthOptions = computed(() =>
  monthItems.value.map(item => ({
    value: item.id,
    label: item.label,
    disabled: item.isDisabled,
  })),
);

const yearItems = computed(() => getYearItems(minYear.value, maxYear.value));
const yearOptions = computed(() =>
  yearItems.value.map(item => ({
    value: item.id,
    label: item.label,
    disabled: item.isDisabled,
  })),
);

watch(
  () => value.value,
  val => move(val, { position: page.value.position, transition: 'none' }),
);
</script>

<style lang="css">
.vc-title-select-nav {
  display: flex;
  > * + * {
    margin-left: 4px;
  }
}
</style>
