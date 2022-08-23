<script>
import Popover from '../Popover/Popover.vue';
import DatePickerContent from './DatePickerContent.vue';
import { propsDef, emits, createDatePicker } from '../../use/datePicker';

export default {
  name: 'DatePicker',
  inheritAttrs: false,
  components: { Popover, DatePickerContent },
  emits,
  props: propsDef,
  setup(props, ctx) {
    return createDatePicker(props, ctx);
  },
};
</script>

<template>
  <template v-if="$slots.default">
    <slot v-bind="slotArgs" />
    <Popover
      :id="datePickerPopoverId"
      placement="bottom-start"
      :class="`vc-date-picker-content vc-${theme.displayMode} vc-${theme.color}`"
      ref="popover"
    >
      <DatePickerContent v-bind="$attrs" />
    </Popover>
  </template>
  <DatePickerContent v-else v-bind="$attrs" />
</template>
