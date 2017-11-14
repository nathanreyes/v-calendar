<template>
<section id='api' class='section'>
  <div class='container'>
    <h3 class='title has-text-primary is-spaced'>API</h3>
    <b-message type='is-warning'>
      <span class="tag is-warning">Date Picker</span> Denotes API specific to <i>v-date-picker</i> components only.
    </b-message>
    <b-tabs>
      <b-tab-item label='Props'>
        <table-api-props></table-api-props>
      </b-tab-item>
      <b-tab-item label='Events'>
        <table-api-events></table-api-events>
      </b-tab-item>
      <b-tab-item label='Slots'>
        <table-api-slots></table-api-slots>
      </b-tab-item>
      <b-tab-item label='Attribute'>
        <b-tabs>
          <b-tab-item label='Attribute'>
            <table-api-attribute></table-api-attribute>
          </b-tab-item>
          <b-tab-item label='Highlight'>
            <table-api-highlight></table-api-highlight>
          </b-tab-item>
          <b-tab-item label='Dot'>
            <table-api-dot></table-api-dot>
          </b-tab-item>
          <b-tab-item label='Bar'>
            <table-api-bar></table-api-bar>
          </b-tab-item>
        </b-tabs>
      </b-tab-item>
      <b-tab-item label='Page'>
        <table-api-page></table-api-page>
      </b-tab-item>
      <b-tab-item label='Day Info'>
        <table-api-day-info></table-api-day-info>
      </b-tab-item>
    </b-tabs>
  </div>
</section>
</template>

<script>
import TableApiProps from '../tables/TableApiProps';
import TableApiEvents from '../tables/TableApiEvents';
import TableApiSlots from '../tables/TableApiSlots';
import TableApiAttribute from '../tables/TableApiAttribute';
import TableApiHighlight from '../tables/TableApiHighlight';
import TableApiDot from '../tables/TableApiDot';
import TableApiBar from '../tables/TableApiBar';
import TableApiPage from '../tables/TableApiPage';
import TableApiDayInfo from '../tables/TableApiDayInfo';

export default {
  components: {
    TableApiProps,
    TableApiEvents,
    TableApiSlots,
    TableApiAttribute,
    TableApiHighlight,
    TableApiDot,
    TableApiBar,
    TableApiPage,
    TableApiDayInfo,
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