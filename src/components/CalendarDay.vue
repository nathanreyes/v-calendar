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
      :style='contentStyle'>
      {{ label }}
    </div>
  </div>
  <!-- Indicator layer -->
  <div
    class='c-day-layer c-day-box-center-bottom'
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
  <!-- Hover layer -->
  <div class='c-day-layer c-day-box-center-center'>
    <div
      :class='["c-day-content-hover", { "c-day-content-hover-show": showHover }]'
      :style='contentHoverStyle'
      @click='click()'
      @mouseenter='enter()'
      @mouseleave='leave()'>
    </div>
  </div>
</div>
</template>

<script>

export default {
  props: {
    dayHeight: { type: String, default: '32px' },
    contentStyle: Object,
    contentHoverStyle: Object,
    showHover: Boolean,
    backgrounds: Array,
    indicators: Array,
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
  },
  computed: {
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
        highlights: this.highlights,
        indicators: this.indicators,
      };
    },
    transitionName() {
      return this.hasBackgrounds ? this.backgrounds[this.backgrounds.length - 1].transition : '';
    },
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
      this.$emit('dayEnter', this.dayInfo);
    },
    leave() {
      this.$emit('dayLeave', this.dayInfo);
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

.c-day-not-in-month
  opacity: 0.4

.c-day-box-center-center
  +box()

.c-day-box-left-center
  +box(flex-start)

.c-day-box-right-center
  +box(flex-end)

.c-day-box-center-bottom
  +box(center, flex-end)

.c-day-layer
  position: absolute
  left: 0
  right: 0
  top: 0
  bottom: 0

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
  transition: color $dayContentTransitionTime
  pointer-events: none
  z-index: 100

.c-day-content-hover
  width: $dayContentWidth
  height: $dayContentHeight
  border-radius: $dayContentBorderRadius

.c-day-content-hover-show
  transition: $dayContentTransitionTime
  &:hover
    background-color: $dayContentHoverBgColor
    cursor: pointer

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
  margin: 0 0 0 -1px
  transform-origin: 0% 50%

.from-right-enter-active.c-day-box-right-center
  transition: $translateTransition
  animation: fromRightEnter $translateTransition
  margin: 0 -1px 0 0
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
