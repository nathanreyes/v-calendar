<template>
<section id='api' class='section'>
  <h4 class='title is-4 has-text-grey-dark is-spaced'>API</h4>
  <b-tabs v-model='index_level_0'>
    <b-tab-item label='Props'>
      <table-calendar-props></table-calendar-props>
    </b-tab-item>
    <b-tab-item label='Events'>
      <table-calendar-events></table-calendar-events>
    </b-tab-item>
    <b-tab-item label='Slots'>
      <table-calendar-slots></table-calendar-slots>
    </b-tab-item>
    <b-tab-item label='Page'>
      <table-page></table-page>
    </b-tab-item>
    <b-tab-item label='Day Info'>
      <table-day-info></table-day-info>
    </b-tab-item>
  </b-tabs>
</section>
</template>

<script>
import TableCalendarProps from '../tables/TableCalendarProps';
import TableCalendarEvents from '../tables/TableCalendarEvents';
import TableCalendarSlots from '../tables/TableCalendarSlots';
import TableDatePatterns from '../tables/TableDatePatterns';
import TablePage from '../tables/TablePage';
import TableDayInfo from '../tables/TableDayInfo';


export default {
  components: {
    TableCalendarProps,
    TableCalendarEvents,
    TableCalendarSlots,
    TableDatePatterns,
    TablePage,
    TableDayInfo,
  },
  props: {
    selectedTab: { type: null, default: '' },
  },
  data() {
    return {
      index_level_0: this.getTabIndex(0),
    };
  },
  watch: {
    selectedTab(val) {
      this.index_level_0 = this.getTabIndex(0);
    },
  },
  methods: {
    getTabIndex(level) {
      const indices = this.selectedTab.toString().split('.');
      if (level > indices.length) return 0;
      return parseInt(indices[level], 10);
    }
  }
};
</script>