<template>
  <Popover
    :id="datePickerPopoverId"
    placement="bottom-start"
    :class="`vc-date-picker-content vc-${color} vc-${displayMode}`"
    ref="popoverRef"
    @before-show="onPopoverBeforeShow"
    @after-show="onPopoverAfterShow"
    @before-hide="onPopoverBeforeHide"
    @after-hide="onPopoverAfterHide"
  >
    <DatePickerBase v-bind="$attrs" />
  </Popover>
</template>

<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
import { useDatePicker } from '../../use/datePicker';
import Popover from '../Popover/Popover.vue';
import DatePickerBase from './DatePickerBase.vue';

const {
  datePickerPopoverId,
  color,
  displayMode,
  popoverRef,
  onPopoverBeforeShow,
  onPopoverAfterShow,
  onPopoverBeforeHide,
  onPopoverAfterHide,
} = useDatePicker();
</script>
