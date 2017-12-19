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
      class='c-day-layer c-day-inactive c-day-box-center-bottom'
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
  <div slot='popover-content'>
    <!-- Popover header label -->
    <div class='c-day-popover-header'>{{ longLabel }}</div>
    <!-- Popover content rows -->
    <div
      :class='["c-day-popover-row", { "selectable": popover.onSelect }]'
      v-for='(popover, i) in popovers'
      :key='i'
      @click='popoverClick(popover)'>
      <!-- Popover indicator -->
      <div
        class='c-day-popover-indicator'
        v-if='popover.indicatorStyle'>
        <span :style='popover.indicatorStyle'></span>
      </div>
      <!-- Popover label -->
      <div
        class='c-day-popover-content'
        :style='popover.labelStyle'
        v-if='popover.label'>
        {{ popover.label }}
      </div>
      <!-- Popover component -->
      <div
        class='c-day-popover-content'
        v-if='popover.component'>
        <component
          :is='content.component'
          :dayInfo='dayInfo'
          :attribute='popover.attribute'>
        </component>
      </div>
      <a
        v-if='popover.onDelete'
        :class='["c-delete", "is-" + popover.size, { "is-disabled": popover.deleteDisabled}]'
        @click.stop='popoverDelete(popover)'>
      </a>
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
    longLabel() {
      const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
      return this.dayInfo.date.toLocaleDateString(window.navigator.userLanguage || window.navigator.language, options);
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
    dotsStyle() {
      return this.styles.dots;
    },
    hasBars() {
      return arrayHasItems(this.bars);
    },
    barsStyle() {
      return this.styles.bars;
    },
    popoverContentStyle() {
      return this.styles.dayPopoverContent;
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
        this.$emit('dayselect', this.dayInfo, this.attributesMap);
      }
      state.started = false;
    },
    click() {
      if (this.touchState && this.touchState.tapDetected) return;
      this.$emit('dayselect', this.dayInfo, this.attributesMap);
    },
    mouseenter() {
      this.isHovered = true;
      this.$emit('daymouseenter', this.dayInfo, this.attributesMap);
    },
    mouseleave() {
      this.isHovered = false;
      this.$emit('daymouseleave', this.dayInfo, this.attributesMap);
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
          if (attribute.popover) popovers.unshift(this.getPopover(attribute));
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
        labelStyle,
        component,
        hideIndicator,
        size,
        selectDisabled,
        onSelect,
        deleteDisabled,
        onDelete,
        isInteractive,
      } = attribute.popover;
      const popover = {
        key: attribute.key,
        attribute,
        size: size || 'small',
        selectDisabled,
        onSelect,
        deleteDisabled,
        onDelete,
      };
      // Assign style for indicator if needed
      if (!hideIndicator) popover.indicatorStyle = this.getPopoverIndicatorStyle(attribute);
      // Assign popover content label
      if (isString(label)) {
        popover.label = label;
        popover.labelStyle = labelStyle;
      } else if (isFunction(label)) {
        popover.label = label(attribute, this.dayInfo);
        popover.labelStyle = labelStyle;
      }
      // Assign popover content component
      if (component) popover.component = component;
      // Assign interactive flag
      popover.isInteractive =
        (isInteractive !== undefined) ?
        isInteractive :
        !!(this.$listeners.attributeselect || this.$listeners.attributedelete || onSelect || onDelete);
      return popover;
    },
    popoverClick(popover) {
      const { onSelect, attribute } = popover;
      if (isFunction(onSelect)) onSelect(attribute, this.dayInfo);
      this.$emit('attributeselect', attribute, this.dayInfo);
    },
    popoverDelete(popover) {
      const { onDelete, attribute } = popover;
      if (isFunction(onDelete)) onDelete(attribute, this.dayInfo);
      this.$emit('attributedelete', attribute, this.dayInfo);
    },
    getPopoverIndicatorStyle(attribute) {
      if (attribute.highlight) {
        return {
          backgroundColor: attribute.highlight.backgroundColor,
          width: '10px',
          height: '5px',
          borderRadius: '3px',
        };
      }
      if (attribute.dot) {
        return {
          backgroundColor: attribute.dot.backgroundColor,
          width: '5px',
          height: '5px',
          borderRadius: '50%',
        };
      }
      if (attribute.bar) {
        return {
          backgroundColor: attribute.bar.backgroundColor,
          width: '10px',
          height: '3px',
        };
      }
      if (attribute.contentStyle) {
        return {
          backgroundColor: attribute.contentStyle.color,
          width: '5px',
          height: '5px',
        };
      }
      return null;
    },
  },
};
</script>

<style lang='sass' scoped>

@import '../styles/vars.sass'
@import '../styles/mixins.sass'

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
  transition: all $dayContentTransitionTime
  &:not(:last-child)
    margin-right: $dotSpacing

.c-day-bars
  +box(flex-start)
  width: $barWidth

.c-day-bar
  flex-grow: 1
  height: $barHeight
  background-color: $barBackgroundColor
  transition: all $dayContentTransitionTime

.c-day-popover-header
  text-align: center
  padding-bottom: 3px
  border-bottom: 1px solid #dadada
  margin-bottom: 3px
  opacity: 0.7

.c-day-popover-row
  display: flex
  align-items: center
  padding: 2px 5px
  transition: all $dayContentTransitionTime
  &.selectable
    cursor: pointer
    &:hover
      background-color: rgba(0, 0, 0, 0.1)
  &:not(:first-child)
    margin-top: 3px
  .c-day-popover-indicator
    display: flex
    justify-content: center
    align-items: center
    flex-grow: 0
    width: 15px
    margin-right: 3px
    span
      transition: all $dayContentTransitionTime
  .c-day-popover-content
    flex-grow: 1
    transition: all $dayContentTransitionTime
  .c-delete
    +delete
    margin-left: 7px
    &.disabled
      pointer-events: none

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
