<template>
  <div>
    <section-header></section-header>
    <section-intro></section-intro>
    <section-attributes></section-attributes>
    <section-highlights></section-highlights>
    <section-indicators></section-indicators>
    <section-content-styles></section-content-styles>
    <section-date-picker></section-date-picker>
    <section-api></section-api>
    <section-usage></section-usage>
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
