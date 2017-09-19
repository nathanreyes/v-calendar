<template>
  <div class='c-container'>
    <calendar-pane
      :page.sync='fromPage_'
      :min-page='minPage'
      :max-page='maxFromPage'
      :highlights='highlights_'
      v-bind='$attrs'
      v-on='$listeners'>
    </calendar-pane>
    <calendar-pane
      v-if='isDoublePaned'
      :page.sync='toPage_'
      :min-page='minToPage'
      :max-page='maxPage'
      :highlights='highlights_'
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
    highlights: Array,
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
    highlights_() {
      if (!this.highlights || !this.highlights.length) return [];
      return this.highlights
        .filter(h => h.dates && h.dates.length)
        .map(h => Object.assign(h, {
          dates: h.dates.map((d) => {
            if (d.start && d.end) {
              const start = new Date(d.start);
              const end = new Date(d.end);
              start.setHours(0, 0, 0, 0);
              end.setHours(0, 0, 0, 0);
              return { start, end };
            }
            const date = new Date(d);
            date.setHours(0, 0, 0, 0);
            return date;
          }),
        }));
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
  justify-content: center
  flex-wrap: wrap

</style>
