<template>
  <Popover
    :id="dayPopoverId"
    :class="[
      'vc-day-popover-container',
      'vc-theme',
      `vc-${theme.color}`,
      { 'vc-is-dark': theme.isDark },
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

<script lang="ts">
import { defineComponent, computed } from 'vue';
import Popover from '../Popover/Popover.vue';
import PopoverRow from '../PopoverRow/PopoverRow.vue';
import { useCalendarContext } from '../../use/calendar';
import { CalendarDay } from '../../utils/locale';

export default defineComponent({
  components: { Popover, PopoverRow },
  setup() {
    const context = useCalendarContext();
    const { dayPopoverId, theme, masks, locale } = context;
    const format = computed(() => {
      return (date: Date, mask: string) => {
        return locale.value.formatDate(date, mask);
      };
    });

    return {
      dayPopoverId,
      theme,
      masks,
      locale,
      format,
      dayTitle(day: CalendarDay) {
        return locale.value.formatDate(day.date, masks.value.dayPopover);
      },
    };
  },
});
</script>
