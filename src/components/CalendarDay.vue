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
  <!-- Indicator layer -->
  <div
    class='c-day-layer c-day-inactive c-day-box-center-bottom'
    v-if='hasIndicators'>
    <div
      class='c-day-indicators'
      :style='{ marginBottom: indicatorsOffset }'>
      <span
        v-for='indicator in indicators'
        :key='indicator.key'
        class='c-day-indicator'
        :style='indicator.style'>
      </span>
    </div>
  </div>
  <!-- Transparency 'not in month' layer -->
  <div
    class='c-day-layer c-day-inactive shift-left-right c-day-not-in-month'
    :style='{ backgroundColor: dayBackgroundColor }'
    v-if='!inMonth'>
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
    dayContentHoverStyle: Object,
    indicatorsOffset: { type: String, default: '0' },
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
      indicators: [],
      contentStyle: this.dayContentStyle || {},
      contentHoverStyle: this.dayContentHoverStyle || {},
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
    hasIndicators() {
      return this.indicators && this.indicators.length;
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
      const indicators = [];
      const contentStyles = [];
      const contentHoverStyles = [];
      if (this.attributes && this.attributes.length) {
        // Cycle through each attribute
        this.attributes.forEach((a) => {
          // Add background for highlight if needed
          if (a.highlight) backgrounds.push(this.getBackground(a));
          // Add indicator if needed
          if (a.indicator) indicators.push(this.getIndicator(a));
          // Add content style if needed
          if (a.contentStyle) contentStyles.push(a.contentStyle);
          // Add content hover style if needed
          if (a.contentHoverStyle) contentHoverStyles.push(a.contentHoverStyle);
        });
      }
      // Assign day attributes
      this.backgrounds = backgrounds;
      this.indicators = indicators;
      this.contentStyle = Object.assign({}, this.dayContentStyle, ...contentStyles);
      this.contentHoverStyle = Object.assign({}, this.dayContentHoverStyle, ...contentHoverStyles);
    },
    getBackground(attribute) {
      // Initialize the background object
      const dateInfo = attribute.dateInfo;
      const highlight = attribute.highlight;
      const height = highlight.height || '1.8rem';
      const background = {
        key: attribute.key,
        highlight,
        dateInfo,
        style: {
          backgroundColor: highlight.backgroundColor || 'rgba(0, 0, 0, 0.5)',
          borderColor: highlight.borderColor,
          borderWidth: highlight.borderWidth || '0',
          borderStyle: highlight.borderStyle || 'solid',
          borderRadius: highlight.borderRadius || height,
          width: height,
          height,
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
    getIndicator(attribute) {
      const indicator = attribute.indicator;
      const diameter = indicator.diameter || '5px';
      return {
        key: attribute.key,
        dateInfo: attribute.dateInfo,
        style: {
          backgroundColor: indicator.backgroundColor || 'rgba(0, 0, 0, 0.5)',
          borderWidth: indicator.borderWidth || '0',
          borderStyle: indicator.borderStyle || 'solid',
          borderRadius: indicator.borderRadius || '50%',
          width: diameter,
          height: diameter,
        },
      };
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
  color: $dayContentColor
  font-size: $dayContentFontSize
  font-weight: $dayContentFontWeight
  border-radius: $dayContentBorderRadius
  transition: all $dayContentTransitionTime
  user-select: none
  cursor: default

.c-day-indicators
  +box()

.c-day-indicator
  width: $indicatorDiameter
  height: $indicatorDiameter
  border-radius: $indicatorBorderRadius
  background-color: blue
  &:not(:last-child)
    margin-right: $indicatorSpacing

// TRANSITION ANIMATIONS

.background-enter-active

  &.c-day-fade-enter
    transition: $fadeTransition

  &.c-day-slide-right-enter
    animation: $slideRightEnterAnimation
    // transform-origin: 0% 50%

  &.c-day-slide-left-enter
    animation: $slideLeftEnterAnimation
    // transform-origin: 100% 50%

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
