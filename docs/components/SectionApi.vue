<template>
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
      <b-tab-item label='Attribute'>
        <b-tabs>
          <b-tab-item label='Attribute'>
            <calendar-api-attribute></calendar-api-attribute>
          </b-tab-item>
          <b-tab-item label='Highlight'>
            <calendar-api-highlight></calendar-api-highlight>
          </b-tab-item>
          <b-tab-item label='Indicator'>
            <calendar-api-indicator></calendar-api-indicator>
          </b-tab-item>
        </b-tabs>
      </b-tab-item>
      <b-tab-item label='Page'>
        <calendar-api-page></calendar-api-page>
      </b-tab-item>
      <b-tab-item label='Day Info'>
        <calendar-api-day-info></calendar-api-day-info>
      </b-tab-item>
    </b-tabs>
  </div>
</section>
</template>

<script>
import CalendarApiProps from './CalendarApiProps';
import CalendarApiEvents from './CalendarApiEvents';
import CalendarApiSlots from './CalendarApiSlots';
import CalendarApiAttribute from './CalendarApiAttribute';
import CalendarApiHighlight from './CalendarApiHighlight';
import CalendarApiIndicator from './CalendarApiIndicator';
import CalendarApiPage from './CalendarApiPage';
import CalendarApiDayInfo from './CalendarApiDayInfo';

export default {
  components: {
    CalendarApiProps,
    CalendarApiEvents,
    CalendarApiSlots,
    CalendarApiAttribute,
    CalendarApiHighlight,
    CalendarApiIndicator,
    CalendarApiPage,
    CalendarApiDayInfo,
  },
  data() {
    return {
      apiTabIndex: 0,
    };
  },
  methods: {
    selectTab(tab) {
      this.apiTabIndex = ['props', 'events', 'slots', 'highlights', 'indicators', 'page', 'dayInfo'].indexOf(tab);
    },
  },
};
</script>