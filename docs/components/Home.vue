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
import SectionHeader from './SectionHeader';
import SectionIntro from './SectionIntro';
import SectionAttributes from './SectionAttributes';
import SectionContentStyles from './SectionContentStyles';
import SectionHighlights from './SectionHighlights';
import SectionIndicators from './SectionIndicators';
import SectionDatePicker from './SectionDatePicker';
import SectionApi from './SectionApi';
import SectionUsage from './SectionUsage';
import SectionFooter from './SectionFooter';

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
