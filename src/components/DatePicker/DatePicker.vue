<script>
import { propsDef, emits, createDatePicker } from '../../use/datePicker';
import Popover from '../Popover/Popover.vue';
import DatePickerContent from './DatePickerContent.vue';

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
      contentClass="vc-container"
      ref="popover"
    >
      <DatePickerContent v-bind="$attrs" />
    </Popover>
  </template>
  <DatePickerContent v-else v-bind="$attrs" />
</template>
