<template>
  <Popover :id="dayPopoverId" :class="[`vc-${color}`, `vc-${displayMode}`]">
    <template #default="{ data: { day, attributes }, hide }">
      <slot
        :day="day"
        :day-title="dayTitle(day)"
        :attributes="attributes"
        :format="format"
        :masks="masks"
        :hide="hide"
      >
        <div class="vc-day-popover-container">
          <div v-if="masks.dayPopover" class="vc-day-popover-header">
            {{ dayTitle(day) }}
          </div>
          <PopoverRow
            v-for="attribute in attributes"
            :key="attribute.key"
            :attribute="attribute"
          />
        </div>
      </slot>
    </template>
  </Popover>
</template>

<script setup lang="ts">
import Popover from '../Popover/Popover.vue';
import PopoverRow from '../PopoverRow/PopoverRow.vue';
import { useCalendar } from '../../use/calendar';
import { CalendarDay } from '../../utils/page';

const { dayPopoverId, displayMode, color, masks, locale } = useCalendar();

function format(date: Date, mask: string) {
  return locale.value.formatDate(date, mask);
}

function dayTitle(day: CalendarDay) {
  return locale.value.formatDate(day.date, masks.value.dayPopover);
}
</script>
