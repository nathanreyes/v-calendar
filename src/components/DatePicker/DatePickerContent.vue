<script setup lang="ts">
import TimePicker from '../TimePicker/TimePicker.vue';
import { useBase } from '../../use/base';
import { useDatePicker } from '../../use/datePicker';

const { theme } = useBase();
const {
  elOrComp,
  showCalendar,
  isTime,
  isDateTime,
  dateParts,
  attributes,
  onDayClick,
  onDayMouseEnter,
  onDayKeydown,
} = useDatePicker();
</script>
<template>
  <div
    v-if="isTime"
    class="vc-container"
    :class="`vc-${theme.color} vc-${theme.displayMode} vc-bordered`"
    ref="elOrComp"
  >
    <TimePicker v-for="(_, i) in dateParts" :key="i" :position="i" />
    <slot name="footer" />
  </div>
  <Calendar
    v-bind="$attrs"
    :attributes="attributes"
    ref="elOrComp"
    @dayclick="onDayClick"
    @daymouseenter="onDayMouseEnter"
    @daykeydown="onDayKeydown"
    v-else-if="showCalendar"
  >
    <template #footer v-if="isDateTime">
      <TimePicker v-for="(_, i) in dateParts" :key="i" :position="i" />
      <slot name="footer" />
    </template>
  </Calendar>
</template>
