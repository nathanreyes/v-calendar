<template>
<div class='tabs-wrapper'>
  <b-tabs>
    <b-tab-item label='Calendar'>
      <section-intro></section-intro>
      <section-attributes></section-attributes>
      <section-highlights></section-highlights>
      <section-dots></section-dots>
      <section-bars></section-bars>
      <section-popovers></section-popovers>
      <section-content-styles></section-content-styles>
      <section-date-patterns @viewDatePatternsTable='selectedApiTab = 4'></section-date-patterns>
      <section-calendar-api :selectedTab='selectedApiTab'></section-calendar-api>
    </b-tab-item>
    <b-tab-item label='Date Picker'>
      <section-date-picker></section-date-picker>
      <section-date-picker-slot></section-date-picker-slot>
      <section-date-picker-api></section-date-picker-api>
    </b-tab-item>
    <!-- <b-tab-item label='Popover'>
      <section-popover></section-popover>
      <section-popover-api></section-popover-api>
    </b-tab-item> -->
  </b-tabs>
</div>
</template>

<script>
import SectionIntro from '../sections/SectionIntro';
import SectionAttributes from '../sections/SectionAttributes';
import SectionContentStyles from '../sections/SectionContentStyles';
import SectionHighlights from '../sections/SectionHighlights';
import SectionDots from '../sections/SectionDots';
import SectionBars from '../sections/SectionBars';
import SectionPopovers from '../sections/SectionPopovers';
import SectionDatePatterns from '../sections/SectionDatePatterns';
import SectionCalendarApi from '../sections/SectionCalendarApi';
import SectionDatePicker from '../sections/SectionDatePicker';
import SectionDatePickerSlot from '../sections/SectionDatePickerSlot';
import SectionDatePickerApi from '../sections/SectionDatePickerApi';
import SectionPopover from '../sections/SectionPopover';
import SectionPopoverApi from '../sections/SectionPopoverApi';

export default {
  components: {
    SectionIntro,
    SectionAttributes,
    SectionContentStyles,
    SectionHighlights,
    SectionDots,
    SectionBars,
    SectionPopovers,
    SectionDatePatterns,
    SectionCalendarApi,
    SectionDatePicker,
    SectionDatePickerSlot,
    SectionDatePickerApi,
    SectionPopover,
    SectionPopoverApi,
  },
  data() {
    return {
      selectedApiTab: 0,
    };
  },
};
</script>

<style lang='sass' scoped>
.tabs-wrapper
  margin-top: 30px
  /deep/ > .b-tabs
    > .tabs
      li:first-child
        margin-left: 40px
</style>
