<template>
<popover
  align='center'
  transition='fade'
  class='c-day-popover'
  :content-offset='popoverContentOffset'
  :visibility='popoverVisibility'
  :content-style='popoverContentStyle'
  :is-interactive='popoverIsInteractive'
  toggle-visible-on-click>
  <div
    class='c-day'
    :style='dayCellStyle'>
    <!-- Background layers -->
    <transition-group
      name='background'
      tag='div'
      class='c-day-backgrounds'>
      <div
        v-for='background in backgrounds'
        :key='background.key'
        :class='background.wrapperClass'>
        <div
          class='c-day-background'
          :style='background.style'>
        </div>
      </div>
    </transition-group>
    <!-- Content layer -->
    <div
      class='c-day-layer c-day-box-center-center'>
      <div
        ref='dayContent'
        class='c-day-content'
        :style='contentStyle_'
        @click='click'
        @mouseenter='mouseenter'
        @mouseover='mouseover'
        @mouseleave='mouseleave'>
        {{ label }}
      </div>
    </div>
    <!-- Dots layer -->
    <div
      class='c-day-layer c-day-box-center-bottom'
      v-if='hasDots'>
      <div
        class='c-day-dots'
        :style='dotsStyle'>
        <span
          v-for='dot in dots'
          :key='dot.key'
          class='c-day-dot'
          :style='dot.style'>
        </span>
      </div>
    </div>
    <!-- Bars layer -->
    <div
      class='c-day-layer c-day-box-center-bottom'
      v-if='hasBars'>
      <div
        class='c-day-bars'
        :style='barsStyle'>
        <span
          v-for='bar in bars'
          :key='bar.key'
          class='c-day-bar'
          :style='bar.style'>
        </span>
      </div>
    </div>
  </div>
  <!-- Popover content -->
  <div
    class='c-day-popover-content'
    slot='popover-content'>
    <!-- Header slot -->
    <slot
      name='popover-header'
      :day-info='dayInfo'
      :attributes='attributesList'>
    </slot>
    <!-- Content row slots -->
    <calendar-day-popover-row
      v-for='popover in popovers'
      :key='popover.key'
      :attribute='popover.attribute'
      :hide-indicator='popover.hideIndicator'>
      <slot
        :name='popover.slot'
        :attribute='popover.attribute'
        :custom-data='popover.attribute.customData'
        :day-info='dayInfo'>
        <span
          v-if='popover.label'
          class='popover-label'
          :style='popover.labelStyle'
          :key='popover.key'>
          {{ popover.label }}
        </span>
        <component
          v-if='popover.component'
          :is='popover.component'
          :attribute='popover.attribute'
          :day-info='dayInfo'>
        </component>
      </slot>
    </calendar-day-popover-row>
  </div>
</popover>
</template>

<script>
import Popover from './Popover';
import CalendarDayPopoverRow from './CalendarDayPopoverRow';
import { arrayHasItems, objectFromArray } from '../utils/helpers';
import { isFunction } from '../utils/typeCheckers';

export default {
  components: {
    Popover,
    CalendarDayPopoverRow,
  },
  props: {
    dayInfo: { type: Object, required: true },
    attributes: Object,
    popoverContentOffset: { type: String, default: '7px' },
    styles: Object,
  },
  data() {
    return {
      backgrounds: [],
      dots: [],
      bars: [],
      popovers: [],
      contentStyle: null,
      contentHoverStyle: null,
      popoverVisibility: 'hidden',
      popoverIsInteractive: false,
      isHovered: false,
    };
  },
  computed: {
    label() {
      return this.dayInfo.label;
    },
    dateTime() {
      return this.dayInfo.dateTime;
    },
    inMonth() {
      return this.dayInfo.inMonth;
    },
    dayCellStyle() {
      // Merge 'not in month' style if needed
      return {
        ...this.styles.dayCell,
        ...(!this.inMonth && this.styles.dayCellNotInMonth),
      };
    },
    contentStyle_() {
      const disableEvents = this.dayCellStyle && (parseFloat(this.dayCellStyle.opacity) === 0 || this.dayCellStyle.pointerEvents === 'none');
      return {
        ...this.contentStyle,
        ...(this.isHovered && this.contentHoverStyle),
        ...(disableEvents && { pointerEvents: 'none' }),
      };
    },
    attributesList() {
      return this.attributes.find(this.dayInfo);
    },
    attributesMap() {
      return objectFromArray(this.attributesList);
    },
    hasBackgrounds() {
      return arrayHasItems(this.backgrounds);
    },
    hasDots() {
      return arrayHasItems(this.dots);
    },
    dotsStyle() {
      return this.styles.dots;
    },
    hasBars() {
      return arrayHasItems(this.bars);
    },
    barsStyle() {
      return this.styles.bars;
    },
    hasPopovers() {
      return !!arrayHasItems(this.popovers);
    },
    popoverContentStyle() {
      return this.styles.dayPopoverContent;
    },
    eventDayInfo() {
      return {
        ...this.dayInfo,
        el: this.$refs.dayContent,
      };
    },
  },
  watch: {
    attributes() {
      this.processAttributes();
    },
    styles() {
      this.processAttributes();
    },
    popovers(val) {
      let visibility = '';
      let isInteractive = false;
      let content;
      val.forEach((popover) => {
        if (!visibility && popover.visibility) visibility = popover.visibility;
        isInteractive = isInteractive || popover.isInteractive;
        content = content || popover.label || popover.component || popover.slot;
      });
      this.popoverVisibility = visibility || (content && 'hover') || 'hidden';
      this.popoverIsInteractive = isInteractive;
    },
  },
  created() {
    this.processAttributes();
  },
  methods: {
    click() {
      this.$emit('dayselect', this.eventDayInfo, this.attributesMap);
    },
    mouseenter() {
      this.$emit('daymouseenter', this.eventDayInfo, this.attributesMap);
    },
    mouseover() {
      this.isHovered = true;
      this.$emit('daymouseover', this.eventDayInfo, this.attributesMap);
    },
    mouseleave() {
      this.isHovered = false;
      this.$emit('daymouseleave', this.eventDayInfo, this.attributesMap);
    },
    processAttributes() {
      const backgrounds = [];
      const dots = [];
      const bars = [];
      const popovers = [];
      const contentStyles = [];
      const contentHoverStyles = [];
      // Get the day attributes
      this
        .attributesList
        .forEach((attribute) => {
          const { highlight, highlightCaps, dot, bar, popover, contentStyle, contentStyleCaps, contentHoverStyle } = attribute;
          const { startTime, endTime } = attribute.targetDate;
          const onStart = startTime === this.dateTime;
          const onEnd = endTime === this.dateTime;
          // Add backgrounds for highlight if needed
          if (highlight && !(onStart && onEnd && highlightCaps)) backgrounds.push(this.getBackground(attribute));
          if (highlightCaps && (onStart || onEnd)) backgrounds.push(this.getBackgroundCap(attribute));
          // Add dot if needed
          if (dot) dots.push(this.getDot(attribute));
          // Add bar if needed
          if (bar) bars.push(this.getBar(attribute));
          // Add popover if needed
          if (popover) popovers.unshift(this.getPopover(attribute));
          // Add content style if needed
          if (contentStyle && !(onStart && onEnd && contentStyleCaps)) contentStyles.push(contentStyle);
          if (contentStyleCaps && (onStart || onEnd)) contentStyles.push(contentStyleCaps);
          // Add content hover style if needed
          if (contentHoverStyle) contentHoverStyles.push(contentHoverStyle);
        });
      // Assign day attributes
      this.backgrounds = backgrounds;
      this.dots = dots;
      this.bars = bars;
      this.popovers = popovers;
      this.contentStyle = Object.assign({}, this.styles.dayContent, ...contentStyles);
      this.contentHoverStyle = Object.assign({}, this.styles.dayContentHover, ...contentHoverStyles);
    },
    getBackground(attribute) {
      // Initialize the background object
      const { key, highlight, targetDate } = attribute;
      const { animated, width, height, backgroundColor, borderColor, borderWidth, borderStyle, opacity } = highlight;
      const borderRadius = highlight.borderRadius || ((targetDate.isDate || targetDate.isComplex) ? '50%' : '290486px');
      const background = {
        key,
        style: {
          width: width || height,
          height,
          backgroundColor,
          borderColor,
          borderWidth,
          borderStyle,
          borderRadius,
          opacity,
        },
      };
      if (targetDate.isDate || targetDate.isComplex) {
        background.wrapperClass = `c-day-layer c-day-box-center-center ${animated ? 'c-day-scale-enter c-day-scale-leave' : ''}`;
      } else {
        const onStart = targetDate.startTime === this.dateTime;
        const onEnd = targetDate.endTime === this.dateTime;
        const endLongWidth = '95%';
        const endShortWidth = '50%';
        // Is the day date on the highlight start and end date
        if (onStart && onEnd) {
          const animation = animated ? 'c-day-scale-enter c-day-scale-leave' : '';
          background.wrapperClass = `c-day-layer c-day-box-center-center ${animation}`;
          background.style.width = endLongWidth;
          background.style.borderWidth = borderWidth;
          background.style.borderRadius = `${borderRadius} ${borderRadius} ${borderRadius} ${borderRadius}`;
        // Is the day date on the highlight start date
        } else if (onStart) {
          const animation = animated ? 'c-day-slide-left-scale-enter' : '';
          background.wrapperClass = `c-day-layer c-day-box-right-center shift-right ${animation}`;
          if (attribute.highlightCaps) {
            background.style.width = endShortWidth;
            background.style.borderWidth = `${borderWidth} 0 ${borderWidth} 0`;
            background.style.borderRadius = 0;
          } else {
            background.style.width = endLongWidth;
            background.style.borderWidth = `${borderWidth} 0 ${borderWidth} ${borderWidth}`;
            background.style.borderRadius = `${borderRadius} 0 0 ${borderRadius}`;
          }
        // Is the day date on the highlight end date
        } else if (onEnd) {
          const animation = animated ? 'c-day-slide-right-scale-enter' : '';
          background.wrapperClass = `c-day-layer c-day-box-left-center shift-left ${animation}`;
          if (attribute.highlightCaps) {
            background.style.width = endShortWidth;
            background.style.borderWidth = `${borderWidth} 0 ${borderWidth} 0`;
            background.style.borderRadius = 0;
          } else {
            background.style.width = endLongWidth;
            background.style.borderWidth = `${borderWidth} ${borderWidth} ${borderWidth} 0`;
            background.style.borderRadius = `0 ${borderRadius} ${borderRadius} 0`;
          }
        // Is the day date between the highlight start/end dates
        } else {
          background.wrapperClass = 'c-day-layer c-day-box-center-center shift-left-right';
          background.style.width = '100%';
          background.style.borderWidth = `${borderWidth} 0`;
          background.style.borderRadius = '0';
        }
      }
      return background;
    },
    getBackgroundCap(attribute) {
      const { key, highlightCaps, targetDate } = attribute;
      const { startTime, endTime } = targetDate;
      const { animated, width, height, backgroundColor, borderColor, borderWidth, borderStyle, opacity } = highlightCaps;
      const borderRadius = highlightCaps.borderRadius || '50%';
      let animation = '';
      const backgroundExists = !!this.backgrounds.find(b => b.key === key);
      if (animated) {
        if (startTime === endTime) {
          animation = 'c-day-scale-enter c-day-scale-leave';
        } else if (startTime === this.dateTime) {
          animation = backgroundExists ? 'c-day-slide-right-translate-enter' : 'c-day-slide-left-translate-enter';
        } else {
          animation = backgroundExists ? 'c-day-slide-left-translate-enter' : 'c-day-slide-right-translate-enter';
        }
      }
      return {
        key: `${key}-cap`,
        wrapperClass: `c-day-layer c-day-box-center-center ${animated ? animation : ''}`,
        style: {
          width: width || height,
          height,
          backgroundColor,
          borderColor,
          borderWidth,
          borderStyle,
          borderRadius,
          opacity,
        },
      };
    },
    getDot({ key, dot }) {
      return {
        key,
        style: {
          width: dot.diameter,
          height: dot.diameter,
          backgroundColor: dot.backgroundColor,
          borderColor: dot.borderColor,
          borderWidth: dot.borderWidth,
          borderStyle: dot.borderStyle,
          borderRadius: dot.borderRadius,
          opacity: dot.opacity,
        },
      };
    },
    getBar({ key, bar }) {
      return {
        key,
        style: {
          height: bar.height,
          backgroundColor: bar.backgroundColor,
          borderColor: bar.borderColor,
          borderWidth: bar.borderWidth,
          borderStyle: bar.borderStyle,
          opacity: bar.opacity,
        },
      };
    },
    getPopover(attribute) {
      const {
        label,
        labelStyle,
        component,
        slot,
        hideIndicator,
        visibility,
        isInteractive,
      } = attribute.popover;
      return {
        key: attribute.key,
        customData: attribute.customData,
        attribute,
        label: isFunction(label) ? label(attribute, this.dayInfo) : label,
        labelStyle: isFunction(labelStyle) ? labelStyle(attribute, this.dayInfo) : labelStyle,
        component,
        slot,
        hideIndicator,
        visibility,
        isInteractive: isInteractive !== undefined ? isInteractive : !!slot,
      };
    },
  },
};
</script>

<style lang='sass' scoped>

@import '../styles/vars.sass'
@import '../styles/mixins.sass'

.c-day-popover
  flex: 1

.c-day
  height: $day-height
  position: relative

.c-day-layer
  position: absolute
  left: 0
  right: 0
  top: 0
  bottom: 0
  pointer-events: none

.c-day-box-center-center
  +box()
  height: 100%
  transform-origin: 50% 50%

.c-day-box-left-center
  +box(flex-start)
  height: 100%
  transform-origin: 0% 50%

.c-day-box-right-center
  +box(flex-end)
  height: 100%
  transform-origin: 100% 50%

.c-day-box-center-bottom
  +box(center, flex-end)

.c-day-backgrounds
  position: relative
  width: 100%
  height: 100%
  overflow: hidden
  backface-visibility: hidden // Prevents glitches in Chrome by forcing hardware acceleration

.c-day-background
  transition: height $background-transition-time, background-color $background-transition-time

.shift-left
  margin-left: -1px

.shift-right
  margin-right: -1px

.shift-left-right
  margin: 0 -1px

.c-day-dots
  +box()

.c-day-dot
  width: $dot-diameter
  height: $dot-diameter
  border-radius: $dot-border-radius
  background-color: $dot-background-color
  transition: all $day-content-transition-time
  &:not(:last-child)
    margin-right: $dot-spacing

.c-day-bars
  +box(flex-start)
  width: $bars-width

.c-day-bar
  flex-grow: 1
  height: $bar-height
  background-color: $bar-background-color
  transition: all $day-content-transition-time

.c-day-content
  +box()
  width: $day-content-width
  height: $day-content-height
  font-size: $day-content-font-size
  font-weight: $day-content-font-weight
  line-height: 1
  border-radius: $day-content-border-radius
  transition: all $day-content-transition-time
  user-select: none
  cursor: default
  pointer-events: all

.c-day-popover-content
  font-size: $day-popover-font-size
  font-weight: $day-popover-font-weight

// TRANSITION ANIMATIONS

.background-enter-active

  &.c-day-fade-enter
    transition: $fade-transition

  &.c-day-slide-right-scale-enter
    animation: $slide-right-scale-enter-animation

  &.c-day-slide-right-translate-enter
    animation: $slide-right-translate-enter-animation

  &.c-day-slide-left-scale-enter
    animation: $slide-left-scale-enter-animation

  &.c-day-slide-left-translate-enter
    animation: $slide-left-translate-enter-animation

  &.c-day-scale-enter
    animation: $scale-enter-animation

.background-leave-active
  &.c-day-fade-leave
    transition: $fade-transition

  &.c-day-scale-leave
    animation: $scale-leave-animation

.background-enter
  &.c-day-fade-enter
    opacity: 0

.background-leave-to
  &.c-day-fade-leave
    opacity: 0

</style>
