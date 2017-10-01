<template>
<div
  :class='["c-day", {"c-day-not-in-month": !inMonth}]'
  :style='{height: dayHeight}'>
  <!-- Background layers -->
  <transition-group
    :name='transitionName'
    tag='div'>
    <div
      v-for='(background, i) in backgrounds'
      :key='background.key'
      :class='getWrapperClass(background)'>
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
      @click='click()'
      @mouseenter='enter()'
      @mouseleave='leave()'>
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
</div>
</template>

<script>
export default {
  props: {
    dayHeight: { type: String, default: '32px' },
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
    transitionName() {
      return this.hasBackgrounds ? this.backgrounds[this.backgrounds.length - 1].transition : '';
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
    getWrapperClass({ horizontalAlign, verticalAlign }) {
      if (!horizontalAlign) horizontalAlign = 'center';
      if (!verticalAlign) verticalAlign = 'center';
      return `c-day-layer c-day-box-${horizontalAlign}-${verticalAlign}`;
    },
    click() {
      this.$emit('dayClick', this.dayInfo);
    },
    enter() {
      this.isHovered = true;
      this.$emit('dayEnter', this.dayInfo);
    },
    leave() {
      this.isHovered = false;
      this.$emit('dayLeave', this.dayInfo);
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
        horizontalAlign: 'center',
        verticalAlign: 'center',
        transition: 'width-height',
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
      // Is the highlight a date range
      if (dateInfo.isRange) {
        const onStart = dateInfo.startTime === this.dateTime;
        const onEnd = dateInfo.endTime === this.dateTime;
        const borderWidth = background.style.borderWidth;
        const borderRadius = background.style.borderRadius;
        const endWidth = '95%';
        // Is the day date on the highlight start and end date
        if (onStart && onEnd) {
          background.style.width = endWidth;
          background.style.borderWidth = borderWidth;
          background.style.borderRadius = `${borderRadius} ${borderRadius} ${borderRadius} ${borderRadius}`;
        // Is the day date on the highlight start date
        } else if (onStart) {
          background.transition = 'from-right';
          background.horizontalAlign = 'right';
          background.style.width = endWidth;
          background.style.borderWidth = `${borderWidth} 0 ${borderWidth} ${borderWidth}`;
          background.style.borderRadius = `${borderRadius} 0 0 ${borderRadius}`;
        // Is the day date on the highlight end date
        } else if (onEnd) {
          background.transition = 'from-left';
          background.horizontalAlign = 'left';
          background.style.width = endWidth;
          background.style.borderWidth = `${borderWidth} ${borderWidth} ${borderWidth} 0`;
          background.style.borderRadius = `0 ${borderRadius} ${borderRadius} 0`;
        // Is the day date between the highlight start/end dates
        } else {
          background.transition = '';
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

$dayWidth: 14.2857%

$dayContentWidth: 1.8rem
$dayContentHeight: 1.8rem
$dayContentColor: #333333
$dayContentFontSize: 0.9rem
$dayContentFontWeight: 500
$dayContentBorderRadius: 50%
$dayContentHoverBgColor: rgba(16, 52, 86, 0.25)
$dayContentTransitionTime: 0.18s ease-in-out

$indicatorDiameter: 5px
$indicatorBorderRadius: 50%
$indicatorSpacing: 3px

$backgroundTransitionTime: .13s ease-in-out
$scaleTransition: all 0.06s ease-in-out
$translateTransition: .18s ease-in-out

=box($justify: center, $align: center)
  display: flex
  justify-content: $justify
  align-items: $align

.c-day
  position: relative
  width: $dayWidth
  overflow: hidden

.c-day-layer
  position: absolute
  left: 0
  right: 0
  top: 0
  bottom: 0

.c-day-inactive
  pointer-events: none

.c-day-not-in-month
  opacity: 0.4

.c-day-box-center-center
  +box()
  margin: 0 -1px

.c-day-box-left-center
  +box(flex-start)
  margin: 0 0 0 -1px

.c-day-box-right-center
  +box(flex-end)
  margin: 0 -1px 0 0

.c-day-box-center-bottom
  +box(center, flex-end)

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

.fade-enter-active, .fade-leave-active
  transition: $dayContentTransitionTime

.fade-enter, .fade-leave-to
  opacity: 0

.width-height-enter-active
  animation: widthHeightEnter 0.14s

.width-height-leave-active
  animation: widthHeightLeave .18s

@keyframes widthHeightEnter
  0%
    transform: scaleX(0.7) scaleY(0.7)
    opacity: 0.3
  90%
    transform: scaleX(1.1) scaleY(1.1)
  95%
    transform: scaleX(0.95) scaleY(0.95)
  100%
    transform: scaleX(1) scaleY(1)
    opacity: 1

@keyframes widthHeightLeave
  0%
    transform: scaleX(1) scaleY(1)
  60%
    transform: scaleX(1.2) scaleY(1.2)
    opacity: 0.2
  100%
    transform: scaleX(1.15) scaleY(1.15)
    opacity: 0

.from-left-enter-active.c-day-box-left-center
  transition: $translateTransition
  animation: fromLeftEnter $translateTransition
  transform-origin: 0% 50%

.from-right-enter-active.c-day-box-right-center
  transition: $translateTransition
  animation: fromRightEnter $translateTransition
  transform-origin: 100% 50%

@keyframes fromLeftEnter
  0%
    transform: scaleX(0)
  60%
    transform: scaleX(1.08)
  100%
    transform: scaleX(1)

@keyframes fromRightEnter
  0%
    transform: scaleX(0)
  60%
    transform: scaleX(1.08)
  100%
    transform: scaleX(1)

</style>
