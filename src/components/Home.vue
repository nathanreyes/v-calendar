<template>
  <div>
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
              <li><a>Calendar</a></li>
              <li><a>Highlights</a></li>
              <li><a>DatePicker</a></li>
            </ul>
          </div>
        </nav>
      </div>
    </section>
    <!--Calendar Intro-->
    <section class='section'>
      <div class='container'>
        <h3 class='title has-text-primary is-spaced'>Calendar</h3>
        <p class='subtitle'><i>V-Calendar</i> is a calendar component for Vue.js designed with these goals in mind:</p>
        <div class='columns'>
          <div class='column content'>
            <ul>
              <li>Lightweight and dependency-free</li>
              <li>Extensive customization via props and scoped slots</li>
              <li>Built-in support for highlights, indicators and datepickers</li>
              <li>Clean and lively design</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
    <!--Calendar Highlights-->
    <section class='section'>
      <div class='container'>
        <h4 class='title is-4 has-text-grey-dark is-spaced'>Highlights</h4>
        <div class='columns'>
          <div class='column is-tw-thirds'>
            <b-tabs>
              <!--Highlights Overview-->
              <b-tab-item label='Overview'>
                <div class='content'>
                  <p class='subtitle'>Every calendar needs a highlighter.</p>
                  <ul>
                    <li>Properties for background, border and content</li>
                    <li>Rounded or squared</li>
                    <li>Span dates and date ranges</li>
                    <li>Optionally animated on appearance or disappearance</li> 
                  </ul>
                </div>
              </b-tab-item>
              <!--Highlights Example Code-->
              <b-tab-item label='Example Code'>
                <pre class='example-code' v-highlight><code class='html'>{{ exHighlightsCode }}</code></pre>
              </b-tab-item>
            </b-tabs>
          </div>
          <div class='column is-one-third'>
            <div class='center-container'>
              <ex-highlights></ex-highlights>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!--Calendar Api-->
    <section class='section'>
      <div class='container'>
        <h4 class='title is-4 has-text-grey-dark is-spaced'>API</h4>
        <b-tabs>
          <b-tab-item label='Props'>
            <calendar-api-props></calendar-api-props>
          </b-tab-item>
          <b-tab-item label='Events'>
            <calendar-api-events></calendar-api-events>
          </b-tab-item>
          <b-tab-item label='Slots'>
            <calendar-api-slots></calendar-api-slots>
          </b-tab-item>
          <b-tab-item label='Highlights'>
            <calendar-api-highlights></calendar-api-highlights>
          </b-tab-item>
        </b-tabs>
      </div>
    </section>
    <!--Date Picker Intro-->
    <section class='section'>
      <div class='container'>
        <h3 class='title has-text-primary is-spaced'>Date Picker</h3>
        <div class='columns is-centered'>
          <div class='column is-two-thirds'>
            <b-tabs>
              <b-tab-item label='Overview'>
                <p class='subtitle'>
                  A <i>v-date-picker</i> is just a <i>v-calendar</i> wrapper.
                </p>
                <p class='content'>
                  It supports all native calendar props and events, but also applies a special highlight for the date selection.
                </p>
                <p class='content'>
                  Supported selection modes include...
                  <ul>
                    <li>Single date</li>
                    <li>Multiple dates</li>
                    <li>Date range</li>
                  </ul>
                </p>
              </b-tab-item>
              <b-tab-item label='Example Code'>
                <pre class='example-code' v-highlight><code class='html'>{{ exDatePickerCode }}</code></pre>
              </b-tab-item>
            </b-tabs>
          </div>
          <div class='column is-one-third'>
            <div class='center-container'>
              <ex-date-picker></ex-date-picker>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!--Date Picker Api-->
    <section class='section'>
      <div class='container'>
        <h4 class='title is-4 has-text-grey-dark is-spaced'>API</h4>
        <b-tabs>
          <b-tab-item label='Props'>
            <date-picker-api-props></date-picker-api-props>
          </b-tab-item>
          <b-tab-item label='Events'>
            <date-picker-api-events></date-picker-api-events>
          </b-tab-item>
        </b-tabs>
      </div>
    </section>
  </div>
</template>

<script>
/* eslint-disable import/no-webpack-loader-syntax */
/* eslint-disable import/no-duplicates */
/* eslint-disable import/first */
import ExHighlights from './ExHighlights';
import ExHighlightsCode from '!!raw-loader!./ExHighlights';
import ExDatePicker from './ExDatePicker';
import ExDatePickerCode from '!!raw-loader!./ExDatePicker';
import CalendarApiProps from './CalendarApiProps';
import CalendarApiEvents from './CalendarApiEvents';
import CalendarApiSlots from './CalendarApiSlots';
import CalendarApiHighlights from './CalendarApiHighlights';
import DatePickerApiProps from './DatePickerApiProps';
import DatePickerApiEvents from './DatePickerApiEvents';

export default {
  components: {
    ExHighlights,
    ExDatePicker,
    CalendarApiProps,
    CalendarApiEvents,
    CalendarApiSlots,
    CalendarApiHighlights,
    DatePickerApiProps,
    DatePickerApiEvents,
  },
  data() {
    return {
      exHighlightsCode: ExHighlightsCode,
      exDatePickerCode: ExDatePickerCode,
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='sass'>

.center-container
  display: flex
  justify-content: center

</style>
