<template>
<div class='c-day'>
  <!-- Background layers -->
  <transition-group
    :name='transitionName'>
    <div
      v-for='(background, i) in backgrounds' :key='background.key'
      :class='getWrapperClass(background)'>
      <div
        class='c-day-background'
        :class='background.class'
        :style='background.style'>
      </div>
    </div>
  </transition-group>
  <!-- Content layer -->
  <div class="c-day-layer c-day-box-center-center">
    <div
      class='c-day-content'
      :class='contentClass'
      :style='contentStyle'
      @click='click()'
      @mouseenter='enter()'
      @mouseleave='leave()'>
      {{ label }}
    </div>
  </div>
  <div class='c-day-layer c-day-not-in-month' v-if='!inMonth'>
  </div>
</div>
</template>

<script>
import Vue from 'vue';

export default {
  props: {
    backgrounds: Array,
    contentClass: String,
    contentStyle: Object,
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
    dayClass() {
      return this.inMonth ? '' : 'c-day-not-in-month';
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

$bgColor: #dae6e7

$dayColor: #333333
$dayFontSize: 0.8rem
$dayFontWeight: 500
$dayWidth: 14.2857%
$dayHeight: 2.2em

$hoverBgColor: rgba(16, 52, 86, 0.25)

$contentTransitionTime: 0.18s ease-in-out
$backgroundTransitionTime: .13s ease-in-out
$scaleTransition: all 0.06s ease-in-out
$translateTransition: .2s ease-in-out

=box($justify: center, $align: center)
  display: flex
  justify-content: $justify
  align-items: $align
  margin: 0
  padding: 0

.c-day
  position: relative
  width: $dayWidth
  height: $dayHeight

.c-day-box-center-center
  +box()

.c-day-box-left-center
  +box(flex-start)

.c-day-box-right-center
  +box(flex-end)

.c-day-not-in-month
  background-color: $bgColor
  pointer-events: none
  opacity: 0.5
  z-index: 100

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
  color: $dayColor
  font-size: $dayFontSize
  font-weight: $dayFontWeight
  cursor: pointer
  user-select: none
  transition: all $contentTransitionTime
  z-index: 10
  &:hover
    background-color: $hoverBgColor

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
