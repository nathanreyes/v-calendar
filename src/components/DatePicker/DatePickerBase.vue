<template>
  <div
    v-if="isTimeMode"
    :class="`vc-container vc-bordered vc-${color} vc-${displayMode}`"
  >
    <TimePicker
      v-for="position in positions"
      :key="position"
      :position="position"
    />
  </div>
  <Calendar
    v-else
    :attributes="attributes"
    ref="calendarRef"
    @dayclick="onDayClick"
    @daymouseenter="onDayMouseEnter"
    @daykeydown="onDayKeydown"
  >
    <template #footer>
      <template v-if="isDateTimeMode">
        <TimePicker
          v-for="position in positions"
          :key="position"
          :position="position"
        />
      </template>
      <CalendarSlot name="dp-footer" />
    </template>
  </Calendar>
</template>

<script setup lang="ts">
import { useDatePicker } from '../../use/datePicker';
import Calendar from '../Calendar/Calendar.vue';
import CalendarSlot from '../Calendar/CalendarSlot.vue';
import TimePicker from './TimePicker.vue';

const {
  attributes,
  calendarRef,
  color,
  displayMode,
  isDateTimeMode,
  isTimeMode,
  isRange,
  onDayClick,
  onDayMouseEnter,
  onDayKeydown,
} = useDatePicker();

const positions = isRange.value ? [0, 1] : [0];
</script>
