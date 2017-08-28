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
    transitionName() {
      let transition = '';
      if (!this.backgrounds || this.backgrounds.length === 0) return transition;
      this.backgrounds.forEach((b) => {
        if (b.transition) transition = b.transition;
      });
      return transition;
    },
  },
  methods: {
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

$dayColor: #fafafa
$dayFontSize: 0.8rem
$dayFontWeight: 500
$dayWidth: 14.2857%
$dayHeight: 2.2em

$hoverBgColor: rgba(16, 52, 86, 0.25)

$transitionTime: 0.18s ease-in-out
$backgroundTransitionTime: 0.1s ease-in-out
$scaleTransition: all 0.06s ease-in-out
$tranlateTransition: 0.2s ease-in-out

=box($justify: center, $align: center)
  display: flex
  justify-content: $justify
  align-items: center
  margin: 0
  padding: 0

*
  box-sizing: border-box

.c-day
  position: relative
  width: $dayWidth
  height: $dayHeight

.c-day-box-center-center
  +box()

.c-day-box-left-center
  +box(flex-start, center)

.c-day-box-right-center
  +box(flex-end, center)

.c-day-not-in-month
  background-color: #3c6186
  pointer-events: none
  opacity: 0.6
  z-index: 100

.c-day-layer
  position: absolute
  width: 100%
  height: 100%
  left: 0
  top: 0

.c-day-background
  transition: all $backgroundTransitionTime
  
.c-day-content
  +box()
  color: $dayColor
  font-size: $dayFontSize
  font-weight: $dayFontWeight
  cursor: pointer
  user-select: none
  transition: all $transitionTime
  z-index: 10
  &:hover
    background-color: $hoverBgColor

.width-height-enter-active
  animation: widthHeightGrow 0.14s

.width-height-leave-active
  animation: widthHeightShrink 0.2s

@keyframes widthHeightGrow
  0%
    transform: scaleX(0.7) scaleY(0.7)
    opacity: 0
  90%
    transform: scaleX(1.1) scaleY(1.1)
  95%
    transform: scaleX(0.95) scaleY(0.95)
  100%
    transform: scaleX(1) scaleY(1)
    opacity: 1

@keyframes widthHeightShrink
  80%
    transform: scaleX(1.1) scaleY(1.1)
  100%
    transform: scaleX(0.5) scaleY(0.5)
    opacity: 0

.from-left-enter-active
  animation: fromLeftEnter $tranlateTransition

@keyframes fromLeftEnter
  0%
    transform: translateX(-20px)
  60%
    transform: translateX(0) scaleX(1.08)
  100%
    transform: scaleX(1)

.from-right-enter-active
  animation: fromRightEnter $tranlateTransition

@keyframes fromRightEnter
  0%
    transform: translateX(20px)
  60%
    transform: translateX(0) scaleX(1.08)
  100%
    transform: scaleX(1)

</style>
