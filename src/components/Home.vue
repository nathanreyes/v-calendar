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
    <section id='intro' class='section'>
      <div class='container'>
        <h3 class='title has-text-primary is-spaced'>Calendar</h3>
        <p class='subtitle'><i>V-Calendar</i> is a calendar component for Vue.js designed with these goals in mind:</p>
        <div class='columns'>
          <!--Intro Overview/Example Code-->
          <div class='column is-one-half'>
            <b-tabs>
              <b-tab-item label='Overview'>
                <ul class='content'>
                  <li>Lightweight and dependency-free</li>
                  <li>Extensive customization via props and scoped slots</li>
                  <li>Built-in support for highlights, indicators and datepickers</li>
                  <li>Clean and lively design</li>
                </ul>
              </b-tab-item>
              <b-tab-item label='Example Code'>
                <pre v-highlight><code class='html'>{{ exIntroCode }}</code></pre>
              </b-tab-item>
            </b-tabs>
          </div>
          <div class='column is-one-half'>
            <b-field>
              <ex-options-popover>
                This is the popover
              </ex-options-popover>
            </b-field>
            <ex-intro></ex-intro>
          </div>
        </div>
      </div>
    </section>
    <!--Calendar Highlights-->
    <section id='highlights' class='section'>
      <div class='container'>
        <h4 class='title is-4 has-text-grey-dark is-spaced'>Highlights</h4>
        <div class='columns'>
          <!--Highlights Overview/Example Code-->
          <div class='column is-one-half'>
            <b-tabs>
              <!--Highlights Overview-->
              <b-tab-item label='Overview'>
                <div class='content'>
                  <ul>
                    <li>Support for custom background, border and content</li>
                    <li>Spans dates and date ranges</li>
                    <li>Optionally animated on appearance or disappearance</li> 
                  </ul>
                </div>
              </b-tab-item>
              <!--Highlights Example Code-->
              <b-tab-item label='Example Code'>
                <pre v-highlight><code class='html'>{{ exHighlightsCode }}</code></pre>
              </b-tab-item>
            </b-tabs>
          </div>
          <!--Highlights Example-->
          <div class='column is-one-half'>
            <ex-highlights></ex-highlights>
          </div>
        </div>
      </div>
    </section>
    <!--Calendar Indicators-->
    <section id='indicators' class='section'>
      <div class='container'>
        <h4 class='title is-4 has-text-grey-dark is-spaced'>Indicators</h4>
        <div class='columns'>
          <div class='column is-one-half'>
            <b-tabs>
              <!--Indicators Overview-->
              <b-tab-item label='Overview'>
                <div class='content'>
                  <p class='subtitle'></p>
                  <ul>
                    <li>Support for custom color and size</li>
                    <li>Spans dates and date ranges</li>
                    <li>Optionally animated on appearance or disappearance</li> 
                  </ul>
                </div>
              </b-tab-item>
              <!--Indicators Example Code-->
              <b-tab-item label='Example Code'>
                <pre v-highlight><code class='html'>{{ exIndicatorsCode }}</code></pre>
              </b-tab-item>
            </b-tabs>
          </div>
          <div class='column is-one-half'>
            <ex-indicators></ex-indicators>
          </div>
        </div>
      </div>
    </section>
    <!--Date Picker Intro-->
    <section id='datepicker' class='section'>
      <div class='container'>
        <h3 class='title has-text-primary is-spaced'>Date Picker</h3>
        <div class='columns is-centered'>
          <div class='column is-one-half'>
            <b-tabs>
              <b-tab-item label='Overview'>
                <p class='subtitle'>
                  A <i>v-date-picker</i> is just a <i>v-calendar</i> wrapper.
                </p>
                <p class='content'>
                  It supports all native calendar features, but also applies a special highlight for the date selection.
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
                <pre v-highlight><code class='html'>{{ exDatePickerCode }}</code></pre>
              </b-tab-item>
            </b-tabs>
          </div>
          <div class='column is-one-half'>
            <ex-date-picker></ex-date-picker>
          </div>
        </div>
      </div>
    </section>
    <!--Calendar Api-->
    <section id='api' class='section'>
      <div class='container'>
        <h3 class='title has-text-primary is-spaced'>API</h3>
        <b-message type='is-warning'>
          <span class="tag is-warning">Date Picker</span> Denotes API specific to <i>v-date-picker</i> components only.
        </b-message>
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
          <b-tab-item label='Indicators'>
            <calendar-api-indicators></calendar-api-indicators>
          </b-tab-item>
          <b-tab-item label='Page'>
            <calendar-api-page></calendar-api-page>
          </b-tab-item>
        </b-tabs>
      </div>
    </section>
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
import ExIntro from './ExIntro';
import ExIntroCode from '!!raw-loader!./ExIntro';
import ExHighlights from './ExHighlights';
import ExHighlightsCode from '!!raw-loader!./ExHighlights';
import ExIndicators from './ExIndicators';
import ExIndicatorsCode from '!!raw-loader!./ExIndicators';
import ExDatePicker from './ExDatePicker';
import ExDatePickerCode from '!!raw-loader!./ExDatePicker';
import ExOptionsPopover from './ExOptionsPopover';
import CalendarApiProps from './CalendarApiProps';
import CalendarApiEvents from './CalendarApiEvents';
import CalendarApiSlots from './CalendarApiSlots';
import CalendarApiHighlights from './CalendarApiHighlights';
import CalendarApiIndicators from './CalendarApiIndicators';
import CalendarApiPage from './CalendarApiPage';
import CalendarFaqs from './CalendarFAQs';
import Popover from './lib/Popover';

export default {
  components: {
    ExIntro,
    ExHighlights,
    ExIndicators,
    ExDatePicker,
    ExOptionsPopover,
    CalendarApiProps,
    CalendarApiEvents,
    CalendarApiSlots,
    CalendarApiHighlights,
    CalendarApiIndicators,
    CalendarApiPage,
    CalendarFaqs,
    Popover,
  },
  data() {
    return {
      apiTabIndex: 0,
      exIntroCode: ExIntroCode,
      exHighlightsCode: ExHighlightsCode,
      exIndicatorsCode: ExIndicatorsCode,
      exDatePickerCode: ExDatePickerCode,
    };
  },
  methods: {
    selectTab(tab) {
      this.apiTabIndex = ['props', 'events', 'slots', 'highlights', 'indicators', 'page'].indexOf(tab);
    },
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

</style>
