<template>
<div class='c-day'>
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
      class='c-day-content'
      :style='contentStyle_'
      @touchstart='touchstart'
      @touchend='touchend'
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
      :style='{ marginBottom: dotsOffset }'>
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
      :style='{ marginBottom: barsOffset }'>
      <span
        v-for='bar in bars'
        :key='bar.key'
        class='c-day-bar'
        :style='bar.style'>
      </span>
    </div>
  </div>
</div>
</template>

<script>
const _tapTolerance = 0;
const _tapMaxDuration = 200; // ms

export default {
  props: {
    dayBackgroundColor: String,
    dayContentStyle: Object,
    nimDayContentStyle: Object,
    dayContentHoverStyle: Object,
    nimDayContentHoverStyle: Object,
    dotsOffset: { type: String, default: '0' },
    barsOffset: { type: String, default: '0' },
    label: String,
    day: Number,
    date: Date,
    dateTime: Number,
    weekday: Number,
    week: Number,
    month: Number,
    year: Number,
    inMonth: Boolean,
    inPrevMonth: Boolean,
    inNextMonth: Boolean,
    attributes: Array,
  },
  data() {
    return {
      backgrounds: [],
      dots: [],
      bars: [],
      contentStyle: null,
      contentHoverStyle: null,
      isHovered: false,
      touchState: null,
      touchCount: 0,
    };
  },
  computed: {
    contentStyle_() {
      if (this.isHovered) return { ...this.contentStyle, ...this.contentHoverStyle };
      return this.contentStyle;
    },
    hasBackgrounds() {
      return this.backgrounds && this.backgrounds.length;
    },
    hasDots() {
      return this.dots && this.dots.length;
    },
    hasBars() {
      return this.bars && this.bars.length;
    },
    highlights() {
      return this.hasBackgrounds ?
        this.backgrounds.map(b => b.highlight) :
        [];
    },
    dayInfo() {
      return {
        day: this.day,
        weekday: this.weekday,
        week: this.week,
        month: this.month,
        year: this.year,
        date: this.date,
        dateTime: this.dateTime,
        inMonth: this.inMonth,
        inPrevMonth: this.inPrevMonth,
        inNextMonth: this.inNextMonth,
        attributes: this.attributes,
      };
    },
  },
  watch: {
    attributes() {
      this.processAttributes();
    },
    dayContentStyle() {
      this.processAttributes();
    },
    dayContentHoverStyle() {
      this.processAttributes();
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
      state.tapDetected = new Date() - state.startedOn <= _tapMaxDuration &&
        Math.abs(state.x - state.startX) <= _tapTolerance &&
        Math.abs(state.y - state.startY) <= _tapTolerance;
      if (state.tapDetected) {
        this.$emit('daySelect', this.dayInfo);
      }
      state.started = false;
    },
    click() {
      if (this.touchState && this.touchState.tapDetected) return;
      this.$emit('daySelect', this.dayInfo);
    },
    mouseenter() {
      this.isHovered = true;
      this.$emit('dayMouseEnter', this.dayInfo);
    },
    mouseleave() {
      this.isHovered = false;
      this.$emit('dayMouseLeave', this.dayInfo);
    },
    processAttributes() {
      const backgrounds = [];
      const dots = [];
      const bars = [];
      const contentStyles = [];
      const contentHoverStyles = [];
      if (this.attributes && this.attributes.length) {
        // Cycle through each attribute
        this.attributes.forEach((a) => {
          // Add background for highlight if needed
          if (a.highlight) backgrounds.push(this.getBackground(a));
          // Add dot if needed
          if (a.dot) dots.push(this.getDot(a));
          // Add bar if needed
          if (a.bar) bars.push(this.getBar(a));
          // Add content style if needed
          if (a.contentStyle) contentStyles.push(this.inMonth ? a.contentStyle : a.nimContentStyle);
          // Add content hover style if needed
          if (a.contentHoverStyle) contentHoverStyles.push(this.inMonth ? a.contentHoverStyle : a.nimContentHoverStyle);
        });
      }
      // Assign day attributes
      this.backgrounds = backgrounds;
      this.dots = dots;
      this.bars = bars;
      this.contentStyle = Object.assign({}, this.inMonth ? this.dayContentStyle : this.nimDayContentStyle, ...contentStyles);
      this.contentHoverStyle = Object.assign({}, this.inMonth ? this.dayContentHoverStyle : this.nimDayContentHoverStyle, ...contentHoverStyles);
    },
    getBackground(attribute) {
      // Initialize the background object
      const dateInfo = attribute.dateInfo;
      const highlight = this.inMonth ? attribute.highlight : attribute.nimHighlight;
      const background = {
        key: attribute.key,
        dateInfo,
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
        background.wrapperClass = 'c-day-layer c-day-box-center-center c-day-scale-enter c-day-scale-leave';
      } else {
        const onStart = dateInfo.startTime === this.dateTime;
        const onEnd = dateInfo.endTime === this.dateTime;
        const borderWidth = background.style.borderWidth;
        const borderRadius = background.style.borderRadius;
        const endWidth = '95%';
        // Is the day date on the highlight start and end date
        if (onStart && onEnd) {
          background.wrapperClass = 'c-day-layer c-day-box-center-center c-day-scale-enter c-day-scale-leave';
          background.style.width = endWidth;
          background.style.borderWidth = borderWidth;
          background.style.borderRadius = `${borderRadius} ${borderRadius} ${borderRadius} ${borderRadius}`;
        // Is the day date on the highlight start date
        } else if (onStart) {
          background.wrapperClass = 'c-day-layer c-day-box-right-center shift-right c-day-slide-left-enter';
          background.style.width = endWidth;
          background.style.borderWidth = `${borderWidth} 0 ${borderWidth} ${borderWidth}`;
          background.style.borderRadius = `${borderRadius} 0 0 ${borderRadius}`;
        // Is the day date on the highlight end date
        } else if (onEnd) {
          background.wrapperClass = 'c-day-layer c-day-box-left-center shift-left c-day-slide-right-enter';
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
      const dot = this.inMonth ? attribute.dot : attribute.nimDot;
      const nDot = {
        key: attribute.key,
        dateInfo: attribute.dateInfo,
        dot,
        style: {
          width: dot.diameter,
          height: dot.diameter,
          backgroundColor: dot.backgroundColor,
          borderColor: dot.borderColor,
          borderWidth: dot.borderWidth,
          borderStyle: dot.borderStyle,
          borderRadius: dot.borderRadius,
        },
      };
      return nDot;
    },
    getBar(attribute) {
      const bar = this.inMonth ? attribute.bar : attribute.nimBar;
      const nBar = {
        key: attribute.key,
        dateInfo: attribute.dateInfo,
        bar,
        style: {
          height: bar.height,
          backgroundColor: bar.backgroundColor,
          borderColor: bar.borderColor,
          borderWidth: bar.borderWidth,
          borderStyle: bar.borderStyle,
        },
      };
      return nBar;
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

.c-day
  position: relative
  width: $dayWidth
  height: $dayHeight

.c-day-layer
  position: absolute
  left: 0
  right: 0
  top: 0
  bottom: 0

.c-day-inactive
  pointer-events: none

.c-day-not-in-month
  background-color: $paneBgColor
  opacity: 1 - $dayNotInMonthOpacity

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

.shift-left
  margin-left: -1px

.shift-right
  margin-right: -1px

.shift-left-right
  margin: 0 -1px

.c-day-background
  transition: height $backgroundTransitionTime, background-color $backgroundTransitionTime
  
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
