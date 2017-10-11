<template>
<div
  :class='["c-container", { "center": paneCentered }]'>
  <div
    class='c-pane-container'>
    <calendar-pane
      :page.sync='fromPage_'
      :min-page='minPage'
      :max-page='maxFromPage'
      :attributes='attributes_'
      v-bind='$attrs'
      v-on='$listeners'>
    </calendar-pane>
    <calendar-pane
      v-if='isDoublePaned_'
      :page.sync='toPage_'
      :min-page='minToPage'
      :max-page='maxPage'
      :attributes='attributes_'
      v-bind='$attrs'
      v-on='$listeners'>
    </calendar-pane>
  </div>
  <slot name='footer'>
    <div class='c-footer'>
      <!-- <tag>1/21/1983</tag> -->
    </div>
  </slot>
</div>
</template>

<script>
import CalendarPane from './CalendarPane';
import Tag from './Tag';
import '../assets/fonts/vcalendar/vcalendar.scss';
import '../styles/lib.sass';

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
    Tag,
  },
  props: {
    minPage: Object,
    maxPage: Object,
    fromPage: Object,
    toPage: Object,
    isDoublePaned: Boolean,
    attributes: Array,
    dateFormatter: {
      type: Function,
      default: d => d.toLocaleDateString(),
    },
  },
  data() {
    return {
      windowWidth: 0,
      fromPage_: null,
      toPage_: null,
    };
  },
  computed: {
    isDoublePaned_() {
      return this.isDoublePaned && this.windowWidth >= 440;
    },
    paneCentered() {
      return this.isDoublePaned && !this.isDoublePaned_;
    },
    maxFromPage() {
      if (!this.isDoublePaned_) return null;
      return getPrevPage(this.toPage_);
    },
    minToPage() {
      if (!this.isDoublePaned_) return null;
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
    isDoublePaned_() {
      this.refreshToPage();
    },
  },
  created() {
    this.handleResize();
    window.addEventListener('resize', this.handleResize);
    this.refreshFromPage();
    this.refreshToPage();
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    handleResize() {
      this.windowWidth = window.innerWidth;
    },
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

@import '../styles/vars.sass'

.c-container
  display: inline-flex
  flex-direction: column
  align-items: center
  &.center
    display: flex
    align-items: center

.c-pane-container
  display: inline-flex

.c-footer-container
  // width: 100%

.c-footer
  display: flex
  justify-content: center
  padding: 5px 0

</style>
