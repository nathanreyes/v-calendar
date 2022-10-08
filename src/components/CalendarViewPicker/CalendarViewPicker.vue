<template>
  <BaseSelectGroup>
    <BaseIcon name="ChevronDown" size="18" />
    <BaseSelect :options="viewOptions" v-model="view" />
  </BaseSelectGroup>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import BaseIcon from '../BaseIcon/BaseIcon.vue';
import BaseSelectGroup from '../BaseSelectGroup/BaseSelectGroup.vue';
import BaseSelect from '../BaseSelect/BaseSelect.vue';
import { useCalendar } from '../../use/calendar';
import { capitalize } from '../../utils/helpers';

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

<style lang="css" scoped>
.vc-base-select-group {
  margin-right: 1rem;
}
.vc-base-select {
  font-size: var(--vc-text-sm);
}
</style>
