<template>
<div
  class='c-pane-container'
  :class='{ "is-double-paned": isDoublePaned_, "is-expanded": isExpanded }'
  :style='themeStyles_.wrapper'>
  <calendar-pane
    :position='isDoublePaned_ ? 1 : 0'
    :page.sync='fromPage_'
    :min-page='minPage'
    :max-page='maxFromPage'
    :styles='themeStyles_'
    :attributes='attributes_'
    @titleClick='titleClick'
    v-bind='$attrs'
    v-on='$listeners'>
  </calendar-pane>
  <calendar-pane
    v-if='isDoublePaned_'
    :position='2'
    :page.sync='toPage_'
    :min-page='minToPage'
    :max-page='maxPage'
    :styles='themeStyles_'
    :attributes='attributes_'
    @titleClick='titleClick'
    v-bind='$attrs'
    v-on='$listeners'>
  </calendar-pane>
</div>
</template>

<script>
import CalendarPane from './CalendarPane';
import Tag from './Tag';
import '../assets/fonts/vcalendar/vcalendar.scss';
import '../styles/lib.sass';
import DateInfo from '../utils/dateInfo';
import {
  themeStyles,
  getHighlight,
  dot,
  bar,
} from '../utils/defaults';
import {
  todayComps,
  pageIsEqualToPage,
  pageIsBeforePage,
  pageIsAfterPage,
  getPrevPage,
  getNextPage,
  getPageBetweenPages,
  getFirstValidPage,
} from '../utils/helpers';

export default {
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
    isExpanded: Boolean,
    showTags: Boolean,
    themeStyles: Object,
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
      return this.isDoublePaned && this.windowWidth >= 480;
    },
    showFooter() {
      return this.showTags || this.$slots.footer;
    },
    paneCentered() {
      return this.isDoublePaned && !this.isDoublePaned_;
    },
    maxFromPage() {
      if (this.isDoublePaned_) return getPrevPage(this.maxPage);
      return this.maxPage;
    },
    minToPage() {
      if (this.isDoublePaned_) return getNextPage(this.minPage);
      return null;
    },
    themeStyles_() {
      // Mix user supplied styles with default styles
      return { ...themeStyles, ...this.themeStyles };
    },
    attributes_() {
      if (!this.attributes || !this.attributes.length) return [];
      return this.attributes.map((a, i) => {
        const newAttribute = {
          key: a.key || (i + 1).toString(),
          dates: a.dates.map(d => (d instanceof DateInfo ? d : new DateInfo(d, a.order))),
          order: a.order || 0,
        };
        if (a.highlight) {
          newAttribute.highlight = getHighlight(a.highlight);
        }
        if (a.dot) {
          newAttribute.dot = {
            ...dot,
            ...a.dot,
          };
        }
        if (a.bar) {
          newAttribute.bar = {
            ...bar,
            ...a.bar,
          };
        }
        if (a.contentStyle) {
          newAttribute.contentStyle = {
            ...a.contentStyle,
          };
        }
        if (a.contentHoverStyle) {
          newAttribute.contentHoverStyle = {
            ...a.contentHoverStyle,
          };
        }
        return newAttribute;
      });
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
      if (!pageIsBeforePage(value, this.toPage_)) {
        this.toPage_ = getNextPage(this.fromPage_);
      }
    },
    toPage_(value) {
      this.$emit('update:toPage', value);
      if (!pageIsAfterPage(value, this.fromPage_)) {
        this.fromPage_ = getPrevPage(this.toPage_);
      }
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
    titleClick(page) {
      if (pageIsEqualToPage(page, todayComps)) return;
      if (page.position < 2) {
        this.fromPage_ = getFirstValidPage(todayComps, pageIsBeforePage(page, todayComps) ? this.maxFromPage : this.minPage);
      } else {
        this.toPage_ = getFirstValidPage(todayComps, pageIsBeforePage(page, todayComps) ? this.maxPage : this.minToPage);
      }
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
  background-color: $paneBgColor
  border: $paneBorder
  &.center
    display: flex
    align-items: center

.c-pane-container
  flex-shrink: 1
  display: inline-flex
  min-width: $paneMinWidth
  width: $paneWidth
  background-color: $paneBgColor
  border: $paneBorder
  &.is-double-paned
    min-width: $paneMinWidth * 2
    width: $paneWidth * 2
  &.is-expanded
    width: 100%

.c-pane-divider
  width: 1px
  border: 1px inset
  border-color: #e3e3e3

.c-footer-container
  // width: 100%

.c-footer
  display: flex
  justify-content: center
  padding: 5px 0

</style>
