<template>
  <BaseSelect
    v-model="view"
    :options="viewOptions"
    class="vc-view-select"
    show-icon
  />
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { useCalendar } from '../../use/calendar';
import { capitalize } from '../../utils/helpers';
import BaseSelect from '../BaseSelect/BaseSelect.vue';

const { locale, view } = useCalendar();

const viewOptions = computed(() => {
  const names = locale.value.relativeTimeNames;
  return [
    {
      value: 'daily',
      label: capitalize(names.day!),
    },
    {
      value: 'weekly',
      label: capitalize(names.week!),
    },
    {
      value: 'monthly',
      label: capitalize(names.month!),
    },
  ];
});
</script>
