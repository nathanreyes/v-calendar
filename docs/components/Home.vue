<template>
  <div>
    <!--Hero Header-->
    <section-header></section-header>
    <!--Calendar Intro-->
    <section-intro></section-intro>
    <!--Calendar Attributes-->
    <section-attributes></section-attributes>
    <!--Calendar Highlights-->
    <section-highlights></section-highlights>
    <!--Calendar Indicators-->
    <section-indicators></section-indicators>
    <!--Calendar Content Styles-->
    <section-content-styles></section-content-styles>
    <!--Date Picker Intro-->
    <section-date-picker></section-date-picker>
    <!--Calendar Api-->
    <section-api></section-api>
    <!--Calendar Usage-->
    <section-usage></section-usage>
    <!--Footer-->
    <section-footer></section-footer>
  </div>
</template>

<script>
/* eslint-disable import/no-webpack-loader-syntax */
/* eslint-disable import/no-duplicates */
/* eslint-disable import/first */
import SectionHeader from './sections/SectionHeader';
import SectionIntro from './sections/SectionIntro';
import SectionAttributes from './sections/SectionAttributes';
import SectionContentStyles from './sections/SectionContentStyles';
import SectionHighlights from './sections/SectionHighlights';
import SectionIndicators from './sections/SectionIndicators';
import SectionDatePicker from './sections/SectionDatePicker';
import SectionApi from './sections/SectionApi';
import SectionUsage from './sections/SectionUsage';
import SectionFooter from './sections/SectionFooter';

export default {
  components: {
    SectionHeader,
    SectionIntro,
    SectionAttributes,
    SectionContentStyles,
    SectionHighlights,
    SectionIndicators,
    SectionDatePicker,
    SectionApi,
    SectionUsage,
    SectionFooter,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='sass'>

.center-container
  display: flex
  justify-content: center

.b-tabs .tabs
  margin-bottom: 10px

.column.is-example
  margin-top: 39px

</style>
