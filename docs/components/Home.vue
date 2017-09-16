<template>
  <div>
    <!--Hero Header-->
    <section class='hero is-primary'>
      <div class='hero-body'>
        <div class='container has-text-centered'>
          <h1 class='title'>V-Calendar</h1>
          <h2 class='subtitle'>A clean & lively calendar for Vue.js</h2>
        </div>
      </div>
      <!-- Hero footer: will stick at the bottom -->
      <div class="hero-foot">
        <nav class="tabs">
          <div class="container">
            <ul>
              <li><a href='#intro'>Calendar</a></li>
              <li><a href='#highlights'>Highlights</a></li>
              <li><a href='#indicators'>Indicators</a></li>
              <li><a href='#datepicker'>DatePicker</a></li>
              <li><a href='#api'>API</a></li>
              <li><a href='#faqs'>FAQs</a></li>
            </ul>
          </div>
        </nav>
      </div>
    </section>
    <!--Calendar Intro-->
    <section-intro></section-intro>
    <!--Calendar Highlights-->
    <section-highlights></section-highlights>
    <!--Calendar Indicators-->
    <section-indicators></section-indicators>
    <!--Date Picker Intro-->
    <section-date-picker></section-date-picker>
    <!--Calendar Api-->
    <section-api></section-api>
    <!--Calendar FAQs-->
    <section id='faqs' class='section'>
      <div class='container'>
        <h3 class='title has-text-primary is-spaced'>FAQs</h3>
        <calendar-faqs></calendar-faqs>
      </div>
    </section>
  </div>
</template>

<script>
/* eslint-disable import/no-webpack-loader-syntax */
/* eslint-disable import/no-duplicates */
/* eslint-disable import/first */
import SectionIntro from './SectionIntro';
import SectionHighlights from './SectionHighlights';
import SectionIndicators from './SectionIndicators';
import SectionDatePicker from './SectionDatePicker';
import SectionApi from './SectionApi';
import CalendarFaqs from './CalendarFAQs';

export default {
  components: {
    SectionIntro,
    SectionHighlights,
    SectionIndicators,
    SectionDatePicker,
    SectionApi,
    CalendarFaqs,
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
