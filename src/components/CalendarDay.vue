<template>
<popover
  align='center'
  transition='fade'
  class='c-day-popover'
  :content-offset='popoverContentOffset'
  :visibility='popoverVisibility'
  :content-style='popoverContentStyle'
  :is-interactive='popoverIsInteractive'
  @got-focus='isFocused = true'
  @lost-focus='isFocused = false'
  toggle-visible-on-click>
  <div
    class='c-day'
    :style='dayCellStyle'>
    <!-- Background layers -->
    <transition-group
      name='background'
      tag='div'
      class='c-day-backgrounds c-day-layer'>
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
      class='c-day-content-wrapper'
      @click='click'
      @mouseenter='mouseenter'
      @mouseover='mouseover'
      @mouseleave='mouseleave'>
      <slot
        name='day-content' 
        :day='day'
        :content-style='contentStyle'
        :attributes='attributesList'>
        <div
          class='c-day-content'
          :style='contentStyle'>
          <div>
            {{ day.label }}
          </div>
        </div>
      </slot>
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
    <!-- Day popover header slot -->
    <slot
      name='day-popover-header'
      :day='day'
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
        :day='day'>
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
          :format='formats.dayPopover'
          :day='day'>
        </component>
      </slot>
    </calendar-day-popover-row>
    <!-- Day popover footer slot -->
    <slot
      name='day-popover-footer'
      :day='day'
      :attributes='attributesList'>
    </slot>
  </div>
</popover>
</template>

<script>
import Popover from './Popover';
import CalendarDayPopoverRow from './CalendarDayPopoverRow';
import {
  arrayHasItems,
  objectFromArray,
  mixinOptionalProps,
} from '@/utils/helpers';
import { isFunction, isObject } from '@/utils/typeCheckers';
import defaults from '@/utils/defaults';

export default {
  components: {
    Popover,
    CalendarDayPopoverRow,
  },
  props: {
    day: { type: Object, required: true },
    attributes: Object,
    popoverContentOffset: { type: Number, default: 7 },
    styles: Object,
    formats: Object,
  },
  data() {
    return {
      isHovered: false,
      isFocused: false,
      glyphs: {},
    };
  },
  computed: {
    label() {
      return this.day.label;
    },
    dateTime() {
      return this.day.dateTime;
    },
    inMonth() {
      return this.day.inMonth;
    },
    dayCellStyle() {
      // Merge 'not in month' style if needed
      return {
        ...this.styles.dayCell,
        ...(!this.inMonth && this.styles.dayCellNotInMonth),
      };
    },
    attributesLength() {
      return this.attributes.length;
    },
    attributesList() {
      return this.attributes.find(this.day);
    },
    attributesMap() {
      return objectFromArray(this.attributesList);
    },
    shouldCheckDirty() {
      return (
        this.attributesLength &&
        !!this.attributesList.find(
          a =>
            isFunction(a.highlight) ||
            isFunction(a.highlightCaps) ||
            isFunction(a.dot) ||
            isFunction(a.bar) ||
            isFunction(a.popover) ||
            isFunction(a.contentStyle),
        )
      );
    },
    isHoveredDirty() {
      return this.shouldCheckDirty && this.isHovered;
    },
    isFocusedDirty() {
      return this.shouldCheckDirty && this.isFocused;
    },
    backgrounds() {
      return this.glyphs.backgrounds;
    },
    hasBackgrounds() {
      return !!arrayHasItems(this.backgrounds);
    },
    dots() {
      return this.glyphs.dots;
    },
    hasDots() {
      return !!arrayHasItems(this.dots);
    },
    dotsStyle() {
      return this.styles.dots;
    },
    bars() {
      return this.glyphs.bars;
    },
    hasBars() {
      return !!arrayHasItems(this.bars);
    },
    barsStyle() {
      return this.styles.bars;
    },
    popovers() {
      return this.glyphs.popovers;
    },
    hasPopovers() {
      return !!arrayHasItems(this.popovers);
    },
    popoverContentStyle() {
      return this.styles.dayPopoverContent;
    },
    popoverState() {
      let visibility = '';
      let isInteractive = false;
      let content;
      this.popovers.forEach(popover => {
        if (!visibility && popover.visibility) visibility = popover.visibility;
        isInteractive = isInteractive || popover.isInteractive;
        content = content || popover.label || popover.component || popover.slot;
      });
      return {
        visibility: visibility || (content && 'hover') || 'hidden',
        isInteractive,
      };
    },
    popoverVisibility() {
      return this.popoverState.visibility;
    },
    popoverIsInteractive() {
      return this.popoverState.isInteractive;
    },
    contentStyle() {
      const userStyle = this.styles.dayContent;
      const disableEvents =
        this.dayCellStyle &&
        (parseFloat(this.dayCellStyle.opacity) === 0 ||
          this.dayCellStyle.pointerEvents === 'none');
      return {
        ...((isFunction(userStyle) &&
          userStyle({
            day: this.day,
            isHovered: this.isHovered,
            isFocused: this.isFocused,
          })) ||
          userStyle),
        ...this.glyphs.contentStyle,
        ...(disableEvents && { pointerEvents: 'none' }),
      };
    },
  },
  watch: {
    isHoveredDirty() {
      this.refreshGlyphs();
    },
    isFocusedDirty() {
      this.refreshGlyphs();
    },
    attributesList(newList, oldList) {
      newList.forEach(n => {
        n.isNew = !oldList.find(o => o.key === n.key);
      });
      this.refreshGlyphs();
    },
  },
  created() {
    this.refreshGlyphs();
  },
  methods: {
    getDayEvent(origEvent) {
      return {
        ...this.day,
        attributes: this.attributesList,
        attributesMap: this.attributesMap,
        event: origEvent,
      };
    },
    click(e) {
      this.$emit('dayclick', this.getDayEvent(e));
    },
    mouseenter(e) {
      this.$emit('daymouseenter', this.getDayEvent(e));
    },
    mouseover(e) {
      this.isHovered = true;
      this.$emit('daymouseover', this.getDayEvent(e));
    },
    mouseleave(e) {
      this.isHovered = false;
      this.$emit('daymouseleave', this.getDayEvent(e));
    },
    refreshGlyphs() {
      // Get the day attributes
      this.glyphs = (this.attributesList || [])
        // Evaluate attribute functions if needed
        .map(attr =>
          this.evalAttribute(attr, this.isHoveredDirty, this.isFocusedDirty),
        )
        .reduce(
          // Add glyphs for each attribute (prioritize from first to last)
          (glyphs, attr) => {
            const {
              highlight,
              highlightCaps,
              onStart,
              onEnd,
              dot,
              bar,
              popover,
            } = attr;
            const { backgrounds, dots, bars, popovers, contentStyle } = glyphs;
            // Add backgrounds for highlight if needed
            if (highlight && !(onStart && onEnd && highlightCaps))
              backgrounds.push(this.getBackground(attr));
            if (highlightCaps && (onStart || onEnd))
              backgrounds.push(this.getBackgroundCap(attr));
            // Add dot if needed
            if (dot) dots.push(this.getDot(attr));
            // Add bar if needed
            if (bar) bars.push(this.getBar(attr));
            // Add popover if needed
            if (popover) popovers.unshift(this.getPopover(attr));
            // Add content style if needed
            Object.assign(contentStyle, attr.contentStyle);
            // Continue configuring glyphs
            return glyphs;
          },
          // Initialize glyphs object
          {
            backgrounds: [],
            dots: [],
            bars: [],
            popovers: [],
            contentStyle: {},
          },
        );
    },
    evalAttribute(attribute, isHovered, isFocused) {
      const { targetDate } = attribute;
      const onStart = targetDate.startTime === this.dateTime;
      const onEnd = targetDate.endTime === this.dateTime;
      const inBetween = !onStart && !onEnd;
      const validate = prop =>
        (isFunction(prop) &&
          prop({
            day: this.day,
            targetDate,
            onStart,
            onEnd,
            inBetween,
            isHovered,
            isFocused,
          })) ||
        (isObject(prop) && prop);
      return mixinOptionalProps(
        attribute,
        {
          ...attribute,
          onStart,
          onEnd,
          inBetween,
        },
        [
          { name: 'highlight', mixin: defaults.highlight, validate },
          { name: 'highlightCaps', mixin: defaults.highlightCaps, validate },
          { name: 'dot', mixin: defaults.dot, validate },
          { name: 'bar', mixin: defaults.bar, validate },
          { name: 'contentStyle', validate },
          { name: 'popover', validate },
          { name: 'customData' },
        ],
      ).target;
    },
    getBackground({ key, highlight, highlightCaps, targetDate }) {
      // Initialize the background object
      const {
        animated,
        width,
        height,
        backgroundColor,
        borderColor,
        borderWidth,
        borderStyle,
        opacity,
      } = highlight;
      const borderRadius =
        highlight.borderRadius ||
        (targetDate.isDate || targetDate.isComplex ? '50%' : '290486px');
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
        background.wrapperClass = `c-day-layer c-day-box-center-center ${
          animated ? 'c-day-scale-enter c-day-scale-leave' : ''
        }`;
      } else {
        const onStart = targetDate.startTime === this.dateTime;
        const onEnd = targetDate.endTime === this.dateTime;
        const endLongWidth = '95%';
        const endShortWidth = '50%';
        // Is the day date on the highlight start and end date
        if (onStart && onEnd) {
          const animation = animated
            ? 'c-day-scale-enter c-day-scale-leave'
            : '';
          background.wrapperClass = `c-day-layer c-day-box-center-center ${animation}`;
          background.style.width = endLongWidth;
          background.style.borderWidth = borderWidth;
          background.style.borderRadius = `${borderRadius} ${borderRadius} ${borderRadius} ${borderRadius}`;
          // Is the day date on the highlight start date
        } else if (onStart) {
          const animation =
            animated && !highlightCaps ? 'c-day-slide-left-scale-enter' : '';
          background.wrapperClass = `c-day-layer c-day-box-right-center shift-right ${animation}`;
          if (highlightCaps) {
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
          const animation =
            animated && !highlightCaps ? 'c-day-slide-right-scale-enter' : '';
          background.wrapperClass = `c-day-layer c-day-box-left-center shift-left ${animation}`;
          if (highlightCaps) {
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
          background.wrapperClass =
            'c-day-layer c-day-box-center-center shift-left-right';
          background.style.width = '100%';
          background.style.borderWidth = `${borderWidth} 0`;
          background.style.borderRadius = '0';
        }
      }
      return background;
    },
    getBackgroundCap(attribute) {
      const { key, highlightCaps, targetDate, isNew } = attribute;
      const { startTime, endTime } = targetDate;
      const {
        animated,
        width,
        height,
        backgroundColor,
        borderColor,
        borderWidth,
        borderStyle,
        opacity,
      } = highlightCaps;
      const borderRadius = highlightCaps.borderRadius || '50%';
      let animation = '';
      if (animated) {
        if (startTime === endTime) {
          animation = 'c-day-scale-enter c-day-scale-leave';
        } else if (startTime === this.dateTime) {
          animation = isNew
            ? 'c-day-slide-left-translate-enter'
            : 'c-day-slide-right-translate-enter';
        } else if (endTime === this.dateTime) {
          animation = isNew
            ? 'c-day-slide-right-translate-enter'
            : 'c-day-slide-left-translate-enter';
        }
      }
      return {
        key: `${key}-cap`,
        wrapperClass: `c-day-layer c-day-box-center-center ${
          animated ? animation : ''
        }`,
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
        label: isFunction(label) ? label(attribute, this.day) : label,
        labelStyle: isFunction(labelStyle)
          ? labelStyle(attribute, this.day)
          : labelStyle,
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
  position: relative
  min-height: $day-min-height
  z-index: 1

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

.c-day-content-wrapper
  display: flex
  justify-content: center
  align-items: center
  pointer-events: all
  user-select: none
  cursor: default

.c-day-content
  display: flex
  justify-content: center
  align-items: center
  width: $day-content-width
  height: $day-content-height
  font-size: $day-content-font-size
  font-weight: $day-content-font-weight
  line-height: 1
  border-radius: $day-content-border-radius
  transition: all $day-content-transition-time
  margin: .1rem .08rem

.c-day-backgrounds
  overflow: hidden
  pointer-events: none
  z-index: -1
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
