<template>
  <Popover
    :id="dayPopoverId"
    :class="[
      'vc-day-popover-container',
      `vc-${theme.color}`,
      `vc-${theme.displayMode}`,
    ]"
  >
    <template #default="{ data: { day, attributes }, hide }">
      <slot
        :day="day"
        :day-title="dayTitle(day)"
        :attributes="attributes"
        :format="format"
        :masks="masks"
        :hide="hide"
      >
        <div v-if="masks.dayPopover" class="vc-day-popover-header">
          {{ dayTitle(day) }}
        </div>
        <PopoverRow
          v-for="attribute in attributes"
          :key="attribute.key"
          :attribute="attribute"
        />
      </slot>
    </template>
  </Popover>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Popover from '../Popover/Popover.vue';
import PopoverRow from '../PopoverRow/PopoverRow.vue';
import { useCalendar } from '../../use/calendar';
import { CalendarDay } from '../../utils/locale';

const { dayPopoverId, theme, masks, locale } = useCalendar();
const format = computed(() => {
  return (date: Date, mask: string) => {
    return locale.value.formatDate(date, mask);
  };
});

function dayTitle(day: CalendarDay) {
  return locale.value.formatDate(day.date, masks.value.dayPopover);
}
</script>
