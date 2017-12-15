<template>
<popover
  align='center'
  transition='fade'
  class='c-popover'
  content-offset='7px'
  :visibility='popoverVisibility'
  :content-style='popoverContentStyle'
  :is-interactive='popoverIsInteractive'>
  <div
    class='c-day'
    :style='dayCellStyle'>
    <!-- Background layers -->
    <transition-group
      name='background'
      tag='div'>
      <div
        v-for='(background, i) in backgrounds'
        :key='background.key'
        :class='background.wrapperClass'>
        <div
          class='c-day-background'
          :style='background.style'>
        </div>
      </div>
    </transition-group>
    <!-- Content layer -->
    <div class='c-day-layer c-day-box-center-center'>
      <div
        ref='dayContent'
        class='c-day-content'
        :style='contentStyle_'
        @touchstart.passive='touchstart'
        @touchend.passive='touchend'
        @click='click($event)'
        @mouseenter='mouseenter'
        @mouseleave='mouseleave'>
        {{ label }}
      </div>
    </div>
    <!-- Dots layer -->
    <div
      class='c-day-layer c-day-inactive c-day-box-center-bottom'
      v-if='hasDots'>
      <div
        class='c-day-dots'
        :style='dotsStyle_'>
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
      class='c-day-layer c-day-inactive c-day-box-center-bottom'
      v-if='hasBars'>
      <div
        class='c-day-bars'
        :style='barsStyle_'>
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
  <div slot='popover-content'>
    <div v-for='(popover, i) in popovers' :key='i'>
      <div v-if='popover.label'>
        {{ popover.label }}
      </div>
      <div v-if='popover.component'>
        <component
          :is='content.component'
          :dayInfo='dayInfo'
          :attribute='popover.attribute'>
        </component>
      </div>
    </div>
  </div>
</popover>
</template>

<script>
import Popover from './Popover';
import defaults from '../utils/defaults';
import { arrayHasItems, objectFromArray, getLastArrayItem } from '../utils/helpers';
import { isString, isFunction } from '../utils/typeCheckers';

export default {
  components: {
    Popover,
  },
  props: {
    dayInfo: { type: Object, required: true },
    attributes: Object,
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
      isHovered: false,
      touchState: null,
      touchCount: 0,
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
      return this.inMonth ? this.styles.dayCell : {
        ...this.styles.dayCell,
        ...this.styles.dayCellNotInMonth,
      };
    },
    contentStyle_() {
      let style = this.contentStyle;
      if (this.isHovered) style = { ...style, ...this.contentHoverStyle };
      return style;
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
    dotsStyle_() {
      return this.styles.dots;
    },
    hasBars() {
      return arrayHasItems(this.bars);
    },
    barsStyle_() {
      return this.styles.bars;
    },
    highlights() {
      return this.hasBackgrounds ?
        this.backgrounds.map(b => b.highlight) :
        [];
    },
    activePopover() {
      return getLastArrayItem(this.popovers);
    },
    popoverVisibility() {
      if (arrayHasItems(this.popovers) && this.popovers.some(p => p.label || p.component)) return 'hover';
      return 'hidden';
    },
    popoverContentStyle() {
      return this.activePopover && this.activePopover.contentStyle;
    },
    popoverIsInteractive() {
      return (this.activePopover && this.popovers.some(p => p.isInteractive));
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
    attributesMap(val) {
      this.$emit('dayUpdated', this.eventDayInfo, val);
    },
  },
  created() {
    this.processAttributes();
  },
  methods: {
    touchstart(e) {
      const t = e.targetTouches[0];
      this.touchState = {
        started: true,
        startedOn: new Date(),
        startX: t.screenX,
        startY: t.screenY,
        x: t.screenX,
        y: t.screenY,
      };
    },
    touchend(e) {
      if (!this.touchState || !this.touchState.started) return;
      const t = e.changedTouches[0];
      const state = this.touchState;
      state.x = t.screenX;
      state.y = t.screenY;
      state.tapDetected = new Date() - state.startedOn <= defaults.maxTapDuration &&
        Math.abs(state.x - state.startX) <= defaults.maxTapTolerance &&
        Math.abs(state.y - state.startY) <= defaults.maxTapTolerance;
      if (state.tapDetected) {
        this.$emit('daySelect', this.dayInfo, this.attributesMap);
      }
      state.started = false;
    },
    click() {
      if (this.touchState && this.touchState.tapDetected) return;
      this.$emit('daySelect', this.eventDayInfo, this.attributesMap);
    },
    mouseenter() {
      this.isHovered = true;
      this.$emit('dayMouseEnter', this.eventDayInfo, this.attributesMap);
    },
    mouseleave() {
      this.isHovered = false;
      this.$emit('dayMouseLeave', this.eventDayInfo, this.attributesMap);
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
          // Add background for highlight if needed
          if (attribute.highlight) backgrounds.push(this.getBackground(attribute));
          // Add dot if needed
          if (attribute.dot) dots.push(this.getDot(attribute));
          // Add bar if needed
          if (attribute.bar) bars.push(this.getBar(attribute));
          // Add popover if needed
          if (attribute.popover) popovers.push(this.getPopover(attribute));
          // Add content style if needed
          if (attribute.contentStyle) contentStyles.push(attribute.contentStyle);
          // Add content hover style if needed
          if (attribute.contentHoverStyle) contentHoverStyles.push(attribute.contentHoverStyle);
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
      const highlight = attribute.highlight;
      const dateInfo = attribute.targetDate;
      const background = {
        key: attribute.key,
        highlight,
        style: {
          width: highlight.height,
          height: highlight.height,
          backgroundColor: highlight.backgroundColor,
          borderColor: highlight.borderColor,
          borderWidth: highlight.borderWidth,
          borderStyle: highlight.borderStyle,
          borderRadius: highlight.borderRadius,
        },
      };
      if (dateInfo.isDate) {
        background.wrapperClass = `c-day-layer c-day-box-center-center${highlight.animated ? ' c-day-scale-enter c-day-scale-leave' : ''}`;
      } else {
        const onStart = dateInfo.startTime === this.dateTime;
        const onEnd = dateInfo.endTime === this.dateTime;
        const borderWidth = background.style.borderWidth;
        const borderRadius = background.style.borderRadius;
        const endWidth = '95%';
        // Is the day date on the highlight start and end date
        if (onStart && onEnd) {
          background.wrapperClass = `c-day-layer c-day-box-center-center${highlight.animated ? ' c-day-scale-enter c-day-scale-leave' : ''}`;
          background.style.width = endWidth;
          background.style.borderWidth = borderWidth;
          background.style.borderRadius = `${borderRadius} ${borderRadius} ${borderRadius} ${borderRadius}`;
        // Is the day date on the highlight start date
        } else if (onStart) {
          background.wrapperClass = `c-day-layer c-day-box-right-center shift-right${highlight.animated ? ' c-day-slide-left-enter' : ''}`;
          background.style.width = endWidth;
          background.style.borderWidth = `${borderWidth} 0 ${borderWidth} ${borderWidth}`;
          background.style.borderRadius = `${borderRadius} 0 0 ${borderRadius}`;
        // Is the day date on the highlight end date
        } else if (onEnd) {
          background.wrapperClass = `c-day-layer c-day-box-left-center shift-left${highlight.animated ? ' c-day-slide-right-enter' : ''}`;
          background.style.width = endWidth;
          background.style.borderWidth = `${borderWidth} ${borderWidth} ${borderWidth} 0`;
          background.style.borderRadius = `0 ${borderRadius} ${borderRadius} 0`;
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
    getDot(attribute) {
      return {
        key: attribute.key,
        dot: attribute.dot,
        style: {
          width: attribute.dot.diameter,
          height: attribute.dot.diameter,
          backgroundColor: attribute.dot.backgroundColor,
          borderColor: attribute.dot.borderColor,
          borderWidth: attribute.dot.borderWidth,
          borderStyle: attribute.dot.borderStyle,
          borderRadius: attribute.dot.borderRadius,
        },
      };
    },
    getBar(attribute) {
      return {
        key: attribute.key,
        bar: attribute.bar,
        style: {
          height: attribute.bar.height,
          backgroundColor: attribute.bar.backgroundColor,
          borderColor: attribute.bar.borderColor,
          borderWidth: attribute.bar.borderWidth,
          borderStyle: attribute.bar.borderStyle,
        },
      };
    },
    getPopover(attribute) {
      const {
        label,
        component,
        contentStyle,
        isDark,
        isInteractive,
      } = attribute.popover;
      const popover = {
        key: attribute.key,
        attribute,
        isDark,
        isInteractive,
        contentStyle: contentStyle || {
          color: '#333333',
          fontSize: '.8rem',
          whiteSpace: 'nowrap',
          ...(isDark ? {
            color: '#fafafa',
            backgroundColor: '#333333',
          } : null),
        },
      };
      if (isString(label)) popover.label = label;
      else if (isFunction(label)) popover.label = label(attribute, this.dayInfo);
      if (component) popover.component = component;
      return popover;
    },
  },
};
</script>

<style lang='sass' scoped>

@import '../styles/vars.sass'

=box($justify: center, $align: center)
  display: flex
  justify-content: $justify
  align-items: $align

.c-popover
  flex: 1
  // height: $dayHeight

.c-day
  position: relative
  overflow: hidden
  height: $dayHeight

.c-day-layer
  position: absolute
  left: 0
  right: 0
  top: 0
  bottom: 0

.c-day-inactive
  pointer-events: none

.c-day-box-center-center
  +box()
  transform-origin: 50% 50%

.c-day-box-left-center
  +box(flex-start)
  transform-origin: 0% 50%

.c-day-box-right-center
  +box(flex-end)
  transform-origin: 100% 50%

.c-day-box-center-bottom
  +box(center, flex-end)

.c-day-background
  transition: height $backgroundTransitionTime, background-color $backgroundTransitionTime

.shift-left
  margin-left: -1px

.shift-right
  margin-right: -1px

.shift-left-right
  margin: 0 -1px

.c-day-dots
  +box()

.c-day-dot
  width: $dotDiameter
  height: $dotDiameter
  border-radius: $dotBorderRadius
  background-color: $dotBackgroundColor
  &:not(:last-child)
    margin-right: $dotSpacing

.c-day-bars
  +box(flex-start)
  width: $barWidth

.c-day-bar
  flex-grow: 1
  height: $barHeight
  background-color: $barBackgroundColor

.c-day-content
  +box()
  width: $dayContentWidth
  height: $dayContentHeight
  font-size: $dayContentFontSize
  font-weight: $dayContentFontWeight
  border-radius: $dayContentBorderRadius
  transition: all $dayContentTransitionTime
  user-select: none
  cursor: default

.c-day-popover
  opacity: 1

// TRANSITION ANIMATIONS

.background-enter-active

  &.c-day-fade-enter
    transition: $fadeTransition

  &.c-day-slide-right-enter
    animation: $slideRightEnterAnimation

  &.c-day-slide-left-enter
    animation: $slideLeftEnterAnimation

  &.c-day-scale-enter
    animation: $scaleEnterAnimation

.background-leave-active
  &.c-day-fade-leave
    transition: $fadeTransition

  &.c-day-scale-leave
    animation: $scaleLeaveAnimation

.background-enter
  &.c-day-fade-enter
    opacity: 0

.background-leave-to
  &.c-day-fade-leave
    opacity: 0

</style>
