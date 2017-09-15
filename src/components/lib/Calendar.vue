<template>
  <div class='c-container'>
    <calendar-pane
      :page.sync='fromPage_'
      :min-page='minPage'
      :max-page='maxFromPage'
      v-bind='$attrs'
      v-on='$listeners'>
    </calendar-pane>
    <calendar-pane
      v-if='isDoublePaned'
      :page.sync='toPage_'
      :min-page='minToPage'
      :max-page='maxPage'
      class='c-pane-right'
      v-bind='$attrs'
      v-on='$listeners'>
    </calendar-pane>
  </div>
</template>

<script>
import CalendarPane from './CalendarPane';

import {
  todayComps,
  getPrevPage,
  getNextPage,
  getPageBetweenPages,
  getFirstValidPage,
} from './utils';

export default {
  components: {
    CalendarPane,
  },
  props: {
    page: Object,
    minPage: Object,
    maxPage: Object,
    fromPage: Object,
    toPage: Object,
    isDoublePaned: Boolean,
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

.c-container
  display: flex

.c-pane-right
  margin-left: -1px

</style>
