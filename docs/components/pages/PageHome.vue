<template>
  <div>
    <section-intro></section-intro>
    <section-attributes></section-attributes>
    <section-highlights></section-highlights>
    <section-dots></section-dots>
    <section-bars></section-bars>
    <section-content-styles></section-content-styles>
    <section-date-picker></section-date-picker>
    <section-date-picker-slot></section-date-picker-slot>
  </div>
</template>

<script>
import SectionIntro from '../sections/SectionIntro';
import SectionAttributes from '../sections/SectionAttributes';
import SectionContentStyles from '../sections/SectionContentStyles';
import SectionHighlights from '../sections/SectionHighlights';
import SectionDots from '../sections/SectionDots';
import SectionBars from '../sections/SectionBars';
import SectionDatePicker from '../sections/SectionDatePicker';
import SectionDatePickerSlot from '../sections/SectionDatePickerSlot';

export default {
  components: {
    SectionIntro,
    SectionAttributes,
    SectionContentStyles,
    SectionHighlights,
    SectionDots,
    SectionBars,
    SectionDatePicker,
    SectionDatePickerSlot,
  },
};
</script>
