<template>
  <div
    :class='["c-container", { "c-wrap": wrapPanes }]'>
    <calendar-pane
      :page.sync='fromPage_'
      :min-page='minPage'
      :max-page='maxFromPage'
      :attributes='attributes_'
      v-bind='$attrs'
      v-on='$listeners'>
    </calendar-pane>
    <calendar-pane
      v-if='isDoublePaned'
      :page.sync='toPage_'
      :min-page='minToPage'
      :max-page='maxPage'
      :attributes='attributes_'
      class='c-pane-right'
      v-bind='$attrs'
      v-on='$listeners'>
    </calendar-pane>
  </div>
</template>

<script>
import CalendarPane from './CalendarPane';
import '../assets/fonts/vcalendar/vcalendar.scss';
import '../styles/lib.scss';

import {
  todayComps,
  getPrevPage,
  getNextPage,
  getPageBetweenPages,
  getFirstValidPage,
  DateInfo,
} from './utils';

export default {
  name: 'vCalendar',
  components: {
    CalendarPane,
  },
  props: {
    minPage: Object,
    maxPage: Object,
    fromPage: Object,
    toPage: Object,
    isDoublePaned: Boolean,
    wrapPanes: Boolean,
    attributes: Array,
  },
  data() {
    return {
      fromPage_: null,
      toPage_: null,
    };
  },
  computed: {
    maxFromPage() {
      if (!this.isDoublePaned) return null;
      return getPrevPage(this.toPage_);
    },
    minToPage() {
      if (!this.isDoublePaned) return null;
      return getNextPage(this.fromPage_);
    },
    attributes_() {
      if (!this.attributes || !this.attributes.length) return [];
      return this.attributes.map((a, i) => Object.assign(
        {},
        a,
        {
          key: a.key || i.toString(),
          dates: a.dates.map(d => (d instanceof DateInfo ? d : new DateInfo(d, a.order))),
        },
      ));
    },
  },
  watch: {
    fromPage() {
      this.refreshFromPage();
    },
    toPage() {
      this.refreshToPage();
    },
    fromPage_(value) {
      this.$emit('update:fromPage', value);
    },
    toPage_(value) {
      this.$emit('update:toPage', value);
    },
    isDoublePaned() {
      this.refreshToPage();
    },
  },
  created() {
    this.refreshFromPage();
    this.refreshToPage();
  },
  methods: {
    refreshFromPage() {
      this.fromPage_ = this.getValidFromPage(this.fromPage, todayComps);
    },
    refreshToPage() {
      this.toPage_ = this.getValidToPage(this.toPage, getNextPage(this.fromPage_));
    },
    getValidFromPage(...args) {
      return getFirstValidPage(
        ...args.map(p => getPageBetweenPages(p, this.minPage, this.maxPage)),
        this.minPage,
        getPrevPage(this.maxPage),
      );
    },
    getValidToPage(...args) {
      return getFirstValidPage(
        ...args.map(p => getPageBetweenPages(p, this.minPage, this.maxPage)),
        this.maxPage,
        getNextPage(this.minPage),
      );
    },
  },
};
</script>

<style lang='sass' scoped>

$minWidth: 260px

.c-container
  display: flex

.c-container.c-wrap
  flex-wrap: wrap
  justify-content: center

</style>
