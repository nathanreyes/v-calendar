<template>
<div
  :class='["c-day", {"c-day-not-in-month": !inMonth}]'
  :style='{height: dayHeight}'>
  <!-- Background layers -->
  <transition-group
    :name='transitionName'>
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
      :style='contentStyle'
      @click='click()'
      @mouseenter='enter()'
      @mouseleave='leave()'>
      {{ label }}
    </div>
  </div>
</div>
</template>

<script>
import Vue from 'vue';

export default {
  props: {
    dayHeight: { type: String, default: '2.2rem' },
    contentStyle: Object,
    backgrounds: Array,
    indicators: Array,
    label: String,
    day: Number,
    date: Date,
    dateTime: Number,
    weekday: Number,
    week: Number,
    month: Number,
    year: Number,
    inMonth: Boolean,
    beforeMonth: Boolean,
    afterMonth: Boolean,
  },
  data() {
    return {
      transitionName: '',
    };
  },
  computed: {
    data() {
      return {
        day: this.day,
        weekday: this.weekday,
        week: this.week,
        month: this.month,
        year: this.year,
        date: this.date,
        dateTime: this.dateTime,
        inMonth: this.inMonth,
        beforeMonth: this.beforeMonth,
        afterMonth: this.afterMonth,
      };
    },
  },
  watch: {
    backgrounds() {
      const transitionName = this.getTransitionName();
      if (transitionName) {
        this.transitionName = transitionName;
      } else {
        Vue.nextTick(() => { this.transitionName = transitionName; });
      }
    },
  },
  methods: {
    getTransitionName() {
      let transition = '';
      if (!this.backgrounds || this.backgrounds.length === 0) return transition;
      this.backgrounds.forEach((b) => {
        if (b.transition) transition = b.transition;
      });
      return transition;
    },
    getWrapperClass({ horizontalAlign, verticalAlign }) {
      if (!horizontalAlign) horizontalAlign = 'center';
      if (!verticalAlign) verticalAlign = 'center';
      return `c-day-layer c-day-box-${horizontalAlign}-${verticalAlign}`;
    },
    click() {
      this.$emit('dayClick', this.data);
    },
    enter() {
      this.$emit('dayEnter', this.data);
    },
    leave() {
      this.$emit('dayLeave', this.data);
    },
  },
};

</script>

<style lang='sass' scoped>

$dayWidth: 14.2857%
$dayHeight: 2.2rem

$dayContentWidth: 2rem
$dayContentHeight: 2rem
$dayContentColor: #333333
$dayContentFontSize: 0.9rem
$dayContentFontWeight: 500
$dayContentBorderRadius: 50%
$dayContentHoverBgColor: rgba(16, 52, 86, 0.25)
$dayContentTransitionTime: 0.18s ease-in-out

$backgroundTransitionTime: .13s ease-in-out
$scaleTransition: all 0.06s ease-in-out
$translateTransition: .18s ease-in-out

=box($justify: center, $align: center)
  display: flex
  justify-content: $justify
  align-items: $align
  margin: 0
  padding: 0

.c-day
  position: relative
  width: $dayWidth
  // height: $dayHeight
  overflow: hidden

.c-day-not-in-month
  opacity: 0.4

.c-day-box-center-center
  +box()

.c-day-box-left-center
  +box(flex-start)

.c-day-box-right-center
  +box(flex-end)

.c-day-layer
  position: absolute
  width: 100%
  height: 100%
  left: 0
  top: 0

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
  cursor: pointer
  user-select: none
  z-index: 10
  &:hover
    background-color: $dayContentHoverBgColor

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
  .c-day-background
    animation: fromLeftEnter $translateTransition
    transform-origin: 0% 50%

.from-right-enter-active.c-day-box-right-center
  transition: $translateTransition
  .c-day-background
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
