<template>
<div
  :class='["c-container", { "center": paneCentered }]'>
  <div
    class='c-pane-container'>
    <calendar-pane
      :position='isDoublePaned_ ? 1 : 0'
      :page.sync='fromPage_'
      :min-page='minPage'
      :max-page='maxFromPage'
      :day-content-style='dayContentStyle_'
      :day-content-hover-style='dayContentHoverStyle'
      :nim-day-content-style='nimDayContentStyle'
      :nim-day-content-hover-style='nimDayContentHoverStyle'
      :attributes='attributes_'
      v-bind='$attrs'
      v-on='$listeners'>
    </calendar-pane>
    <calendar-pane
      v-if='isDoublePaned_'
      :position='2'
      :page.sync='toPage_'
      :min-page='minToPage'
      :max-page='maxPage'
      :day-content-style='dayContentStyle_'
      :day-content-hover-style='dayContentHoverStyle'
      :nim-day-content-style='nimDayContentStyle'
      :nim-day-content-hover-style='nimDayContentHoverStyle'
      :attributes='attributes_'
      v-bind='$attrs'
      v-on='$listeners'>
    </calendar-pane>
  </div>
  <slot name='footer' v-if='showFooter'>
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
  blendObjectColors,
} from '../utils/helpers';

const _defContentStyle = { color: '#333333' };

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
    showTags: Boolean,
    dayContentStyle: Object,
    dayContentHoverStyle: Object,
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
    showFooter() {
      return this.showTags || this.$slots.footer;
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
    dayBackgroundColor() {
      if (this.weeksStyle && this.weeksStyle.backgroundColor) return this.weeksStyle.backgroundColor;
      if (this.style && this.style.backgroundColor) return this.style.backgroundColor;
      return '#fafafa';
    },
    dayContentStyle_() {
      return { ..._defContentStyle, ...this.dayContentStyle };
    },
    nimDayContentStyle() {
      const cs = { ...this.dayContentStyle_ };
      blendObjectColors(cs, ['color', 'backgroundColor', 'borderColor'], this.dayBackgroundColor, 0.6);
      return cs;
    },
    nimDayContentHoverStyle() {
      const chs = { ...this.dayContentHoverStyle };
      blendObjectColors(chs, ['color', 'backgroundColor', 'borderColor'], this.dayBackgroundColor, 0.6);
      return chs;
    },
    attributes_() {
      if (!this.attributes || !this.attributes.length) return [];
      return this.attributes.map((a, i) => {
        const newAttribute = {
          key: a.key || i.toString(),
          dates: a.dates.map(d => (d instanceof DateInfo ? d : new DateInfo(d, a.order))),
          order: a.order || 0,
        };
        if (a.highlight) {
          newAttribute.highlight = {
            height: '1.8rem',
            backgroundColor: '#65999a',
            borderWidth: '0',
            borderStyle: 'solid',
            borderRadius: '1.8rem',
            ...a.highlight,
          };
          newAttribute.nimHighlight = { ...newAttribute.highlight };
          blendObjectColors(newAttribute.nimHighlight, ['backgroundColor', 'borderColor'], this.dayBackgroundColor, 0.6);
        }
        if (a.dot) {
          newAttribute.dot = {
            diameter: '5px',
            backgroundColor: '#65999a',
            borderWidth: '0',
            borderStyle: 'solid',
            borderRadius: '50%',
            ...a.dot,
          };
          newAttribute.nimDot = { ...newAttribute.dot };
          blendObjectColors(newAttribute.nimDot, ['backgroundColor', 'borderColor'], this.dayBackgroundColor, 0.6);
        }
        if (a.bar) {
          newAttribute.bar = {
            height: '3px',
            backgroundColor: '#65999a',
            borderWidth: '0',
            borderStyle: 'solid',
            ...a.bar,
          };
          newAttribute.nimBar = { ...newAttribute.bar };
          blendObjectColors(newAttribute.nimBar, ['backgroundColor', 'borderColor'], this.dayBackgroundColor, 0.6);
        }
        if (a.contentStyle) {
          newAttribute.contentStyle = {
            color: '#333333',
            ...a.contentStyle,
          };
          newAttribute.nimContentStyle = { ...newAttribute.contentStyle };
          blendObjectColors(newAttribute.nimContentStyle, ['color', 'backgroundColor', 'borderColor'], this.dayBackgroundColor, 0.6);
        }
        if (a.contentHoverStyle) {
          newAttribute.contentHoverStyle = {
            ...a.contentHoverStyle,
          };
          newAttribute.nimContentHoverStyle = { ...newAttribute.contentHoverStyle };
          blendObjectColors(newAttribute.nimContentHoverStyle, ['backgroundColor', 'borderColor'], this.dayBackgroundColor, 0.6);
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
  background-color: $paneBgColor
  border: $paneBorder
  &.center
    display: flex
    align-items: center

.c-pane-container
  display: inline-flex
  flex: 1
  align-items: stretch

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
