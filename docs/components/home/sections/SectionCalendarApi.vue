<template>
<section id='api' class='section'>
  <div class='container'>
    <h3 class='title has-text-primary is-spaced'>API</h3>
    <b-tabs>
      <b-tab-item label='Props'>
        <table-calendar-props></table-calendar-props>
      </b-tab-item>
      <b-tab-item label='Events'>
        <table-calendar-events></table-calendar-events>
      </b-tab-item>
      <b-tab-item label='Slots'>
        <table-calendar-slots></table-calendar-slots>
      </b-tab-item>
      <b-tab-item label='Attribute'>
        <b-tabs>
          <b-tab-item label='Attribute'>
            <table-attribute></table-attribute>
          </b-tab-item>
          <b-tab-item label='Highlight'>
            <table-highlight></table-highlight>
          </b-tab-item>
          <b-tab-item label='Dot'>
            <table-dot></table-dot>
          </b-tab-item>
          <b-tab-item label='Bar'>
            <table-bar></table-bar>
          </b-tab-item>
        </b-tabs>
      </b-tab-item>
      <b-tab-item label='Date Patterns'>
        <table-date-patterns></table-date-patterns>
      </b-tab-item>
      <b-tab-item label='Page'>
        <table-page></table-page>
      </b-tab-item>
      <b-tab-item label='Day Info'>
        <table-day-info></table-day-info>
      </b-tab-item>
    </b-tabs>
  </div>
</section>
</template>

<script>
import TableCalendarProps from '../tables/TableCalendarProps';
import TableCalendarEvents from '../tables/TableCalendarEvents';
import TableCalendarSlots from '../tables/TableCalendarSlots';
import TableAttribute from '../tables/TableAttribute';
import TableHighlight from '../tables/TableHighlight';
import TableDot from '../tables/TableDot';
import TableBar from '../tables/TableBar';
import TableDatePatterns from '../tables/TableDatePatterns';
import TablePage from '../tables/TablePage';
import TableDayInfo from '../tables/TableDayInfo';


export default {
  components: {
    TableCalendarProps,
    TableCalendarEvents,
    TableCalendarSlots,
    TableAttribute,
    TableHighlight,
    TableDot,
    TableBar,
    TableDatePatterns,
    TablePage,
    TableDayInfo,
  },
};
</script>