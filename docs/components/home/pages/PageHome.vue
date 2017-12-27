<template>
<div class='container'>
  <b-tabs>
    <b-tab-item label='Overview' icon='calendar-o'>
      <section-intro></section-intro>
      <section-calendar-api :selectedTab='selectedApiTab'></section-calendar-api>
    </b-tab-item>
    <b-tab-item label='Attributes' icon='calendar-check-o'>
      <b-tabs>
        <b-tab-item label='Overview'>
          <section-attributes></section-attributes>
        </b-tab-item>
        <b-tab-item label='Highlights'>
          <section-highlights></section-highlights>
        </b-tab-item>
        <b-tab-item label='Dots'>
          <section-dots></section-dots>
        </b-tab-item>
        <b-tab-item label='Bars'>
          <section-bars></section-bars>
        </b-tab-item>
        <b-tab-item label='Popovers'>
          <section-popovers></section-popovers>
        </b-tab-item>
        <b-tab-item label='Content Styles'>
          <section-content-styles></section-content-styles>
        </b-tab-item>
      </b-tabs>
    </b-tab-item>
    <b-tab-item label='Date Patterns' icon='repeat'>
      <section-date-patterns @viewDatePatternsTable='selectedApiTab = 4'></section-date-patterns>
    </b-tab-item>
    <b-tab-item label='Theming' icon='paint-brush'>
      <section-theming></section-theming>
      <section-styles></section-styles>
    </b-tab-item>
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
import SectionTheming from '../sections/SectionTheming';
import SectionStyles from '../sections/SectionStyles';
import SectionCalendarApi from '../sections/SectionCalendarApi';

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
    SectionTheming,
    SectionStyles,
    SectionCalendarApi,
  },
  data() {
    return {
      selectedApiTab: 0,
    };
  },
};
</script>

<style lang='sass' scoped>
.container
  margin-top: 30px
</style>
