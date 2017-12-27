<template>
<div class='container'>
  <section-date-picker></section-date-picker>
  <section-date-picker-slot></section-date-picker-slot>
  <section-date-picker-api></section-date-picker-api>
</div>
</template>

<script>
import SectionDatePicker from '../sections/SectionDatePicker';
import SectionDatePickerSlot from '../sections/SectionDatePickerSlot';
import SectionDatePickerApi from '../sections/SectionDatePickerApi';

export default {
  components: {
    SectionDatePicker,
    SectionDatePickerSlot,
    SectionDatePickerApi,
  },
};
</script>

<style lang='sass' scoped>
.container
  margin-top: 30px
</style>
