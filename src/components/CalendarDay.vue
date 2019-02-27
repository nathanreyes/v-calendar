<script>
import PopoverRef from './PopoverRef';
import injectMixin from '@/utils/injectMixin';
import {
  evalFn,
  arrayHasItems,
  objectFromArray,
  mixinOptionalProps,
} from '@/utils/helpers';
import defaults from '@/utils/defaults';
import { isFunction, some } from '@/utils/_';

export default {
  name: 'CalendarDay',
  mixins: [injectMixin],
  props: {
    day: { type: Object, required: true },
    attributes: Object,
    popoverContentOffset: { type: Number, default: 7 },
    styles: Object,
    formats: Object,
  },
  render(h) {
    // Backgrounds layer
    const backgroundsLayer = () => {
      return (
        this.hasBackgrounds &&
        h(
          'div',
          {
            class: 'c-day-backgrounds c-day-layer',
          },
          this.backgrounds.map(({ key, wrapperClass, class: bgClass, style }) =>
            h(
              'div',
              {
                key: key,
                class: wrapperClass,
              },
              [
                h('div', {
                  class: `c-day-background ${bgClass}`,
                  style,
                }),
              ],
            ),
          ),
        )
      );
    };

    // Content layer
    const contentLayer = () => {
      return isFunction(this.$scopedSlots['day-content'])
        ? this.$scopedSlots['day-content']({
            day: this.day,
            attributes: this.attributesList,
            dayProps: this.dayContentProps,
            dayEvents: this.dayContentEvents,
          })
        : h(
            'span',
            {
              class: ['c-day-content', this.dayContentClass],
              // style: this.dayContentStyle,
              attrs: { ...this.dayContentProps },
              on: this.dayContentEvents,
            },
            [
              h('span', { class: this.dayHighlightContentClass }, [
                this.day.label,
              ]),
            ],
          );
    };

    // Popover content wrapper
    const contentWrapperLayer = () => {
      if (!this.hasPopovers) {
        return contentLayer();
      }
      return h(
        PopoverRef,
        {
          props: {
            id: this.dayPopoverId,
            args: this.dayEvent,
            visibility: this.popoverVisibility,
            isInteractive: this.popoverIsInteractive,
          },
        },
        [contentLayer()],
      );
    };

    // Dots layer
    const dotsLayer = () => {
      return (
        this.hasDots &&
        h(
          'div',
          {
            class: 'c-day-layer c-day-box-center-bottom',
          },
          [
            h(
              'div',
              {
                class: 'c-day-dots',
                style: this.dotsStyle,
              },
              this.dots.map(({ key, style }) => {
                return h('span', {
                  class: 'c-day-dot',
                  style,
                  key,
                });
              }),
            ),
          ],
        )
      );
    };

    // Bars layer
    const barsLayer = () => {
      return (
        this.hasBars &&
        h(
          'div',
          {
            class: 'c-day-layer c-day-box-center-bottom',
          },
          [
            h(
              'div',
              {
                class: 'c-day-bars',
                style: this.barsStyle,
              },
              this.bars.map(({ key, style }) => {
                return h('span', {
                  class: 'c-day-bar',
                  style,
                  key,
                });
              }),
            ),
          ],
        )
      );
    };

    // Root layer
    return h(
      'div',
      {
        class: [
          'c-day text-sm font-medium',
          ...this.day.classes,
          { 'c-day-box-center-center': !this.$scopedSlots['day-content'] },
        ],
        style: this.dayStyle,
      },
      [backgroundsLayer(), contentWrapperLayer(), dotsLayer(), barsLayer()],
    );
  },
  inject: ['sharedState'],
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
    attributesLength() {
      return this.attributes.length;
    },
    attributesList() {
      return this.attributes.onDay(this.day);
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
    popoverVisibility() {
      return (
        (this.hasPopovers &&
          ['visible', 'hover', 'focus', 'click'].find(v =>
            some(this.popovers, p => p.visibility === v),
          )) ||
        'hidden'
      );
    },
    popoverIsInteractive() {
      return this.hasPopovers && some(this.popovers, p => p.isInteractive);
    },
    dayStyle() {
      return evalFn(this.styles.day, {
        day: this.day,
        isHovered: this.isHovered,
        isFocused: this.isFocused,
      });
    },
    dayContentClass() {
      return this.glyphs.contentClass;
    },
    dayHighlightContentClass() {
      return this.hasBackgrounds
        ? this.backgrounds[this.backgrounds.length - 1].contentClass
        : '';
    },
    dayContentStyle() {
      return this.glyphs.contentStyle;
    },
    dayContentProps() {
      return {
        tabindex: '0',
      };
    },
    dayContentEvents() {
      return {
        click: this.click,
        mouseenter: this.mouseenter,
        mouseover: this.mouseover,
        mouseleave: this.mouseleave,
        focusin: this.focusin,
        focusout: this.focusout,
      };
    },
    dayEvent() {
      return {
        ...this.day,
        el: this.$el,
        attributes: this.attributesList,
        attributesMap: this.attributesMap,
        popovers: this.popovers,
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
    theme() {
      this.refreshGlyphs();
    },
  },
  created() {
    this.refreshGlyphs();
  },
  methods: {
    getDayEvent(origEvent) {
      return {
        ...this.dayEvent,
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
    focusin(e) {
      this.isFocused = true;
      this.$emit('dayfocusin', this.getDayEvent(e));
    },
    focusout(e) {
      this.isFocused = false;
      this.$emit('dayfocusout', this.getDayEvent(e));
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
              contentClass,
              contentStyle,
            } = attr;
            const { backgrounds, dots, bars, popovers } = glyphs;
            // Add backgrounds for highlight if needed
            if (highlight) backgrounds.push(...this.getBackgrounds(attr));
            // Add dot if needed
            if (dot) dots.push(this.getDot(attr));
            // Add bar if needed
            if (bar) bars.push(this.getBar(attr));
            // Add popover if needed
            if (popover) popovers.unshift(this.getPopover(attr));
            // Add content class if needed
            // if (contentClass) glyphs.contentClass.push(contentClass);
            // Add content style if needed
            // Object.assign(glyphs.contentStyle, contentStyle);
            // Continue configuring glyphs
            return glyphs;
          },
          // Initialize glyphs object
          {
            backgrounds: [],
            dots: [],
            bars: [],
            popovers: [],
            contentClass: [],
            contentStyle: {},
          },
        );
    },
    refreshGlyphs2() {
      const glyphs = {
        backgrounds: [],
        dots: [],
        bars: [],
        popovers: [],
        content: {},
      };
    },
    evalAttribute(attribute, isHovered, isFocused) {
      const { targetDate } = attribute;
      const onStart = targetDate.startTime === this.dateTime;
      const onEnd = targetDate.endTime === this.dateTime;
      const inBetween = !onStart && !onEnd;
      const validate = prop =>
        evalFn(prop, {
          day: this.day,
          targetDate,
          onStart,
          onEnd,
          inBetween,
          isHovered,
          isFocused,
        });
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
          { name: 'contentClass', validate },
          { name: 'contentStyle', validate },
          { name: 'popover', validate },
          { name: 'customData' },
        ],
      ).target;
    },
    getBackgrounds({ key, highlight, targetDate }) {
      const backgrounds = [];
      if (!highlight) return backgrounds;

      const { isDate, isComplex, startTime, endTime } = targetDate;
      const { base, start, end, startEnd } = this.theme.normalizeHighlight(
        true,
        this.theme,
      );
      let targetArea;
      if (isDate || isComplex) {
        targetArea = startEnd || start || end || base;
        backgrounds.push({
          key,
          wrapperClass: 'c-day-layer c-day-box-center-center',
          class: `vc-highlight ${targetArea.class}`,
          contentClass: targetArea.contentClass,
          // style: { ...targetArea.style },
        });
      } else {
        const onStart = startTime === this.dateTime;
        const onEnd = endTime === this.dateTime;
        const onStartAndEnd = onStart && onEnd;
        const onStartOrEnd = onStart || onEnd;
        if (onStartAndEnd) {
          targetArea = startEnd || start || end || base;
          backgrounds.push({
            key,
            wrapperClass: 'c-day-layer c-day-box-center-center',
            class: `vc-highlight ${targetArea.class}`,
            contentClass: targetArea.contentClass,
          });
        } else if (onStart) {
          backgrounds.push({
            key,
            wrapperClass: 'c-day-layer c-day-box-right-center',
            class: `vc-highlight vc-highlight-start ${base.class}`,
            contentClass: base.contentClass,
          });
          targetArea = start || startEnd || base;
          if (targetArea) {
            backgrounds.push({
              key: `${key}-start`,
              wrapperClass: 'c-day-layer c-day-box-center-center',
              class: `vc-highlight ${targetArea.class}`,
              contentClass: targetArea.contentClass,
            });
          }
        } else if (onEnd) {
          backgrounds.push({
            key,
            wrapperClass: 'c-day-layer c-day-box-left-center',
            class: `vc-highlight vc-highlight-end ${base.class}`,
            contentClass: base.contentClass,
          });
          targetArea = end || startEnd || base;
          if (targetArea) {
            backgrounds.push({
              key: `${key}-end`,
              wrapperClass: 'c-day-layer c-day-box-center-center',
              class: `vc-highlight ${targetArea.class}`,
              contentClass: targetArea.contentClass,
            });
          }
        } else {
          backgrounds.push({
            key: `${key}-middle`,
            wrapperClass: 'c-day-layer c-day-box-center-center',
            class: `vc-highlight vc-highlight-middle ${base.class}`,
            contentClass: base.contentClass,
          });
        }
      }
      return backgrounds;
    },
    getDots({ key, dot, targetDate }) {
      const dots = [];
      if (!dot) return dots;

      const { isDate, isComplex, startTime, endTime } = targetDate;
      const { base, start, end, startEnd } = this.theme.normalizeDot(
        true,
        this.theme,
      );
      if (isDate) {
        dots.push({
          key,
          class: 
        })
      } else {
        const onStart = startTime === this.dateTime;
        const onEnd = endTime === this.dateTime;
        const onStartAndEnd = onStart && onEnd;
        const onStartOrEnd = onStart || onEnd;
      }
      return dots;
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
        label,
        labelStyle,
        component,
        slot,
        hideIndicator,
        visibility: visibility || (label ? 'hover' : 'click'),
        isInteractive: isInteractive !== undefined ? isInteractive : !label,
      };
    },
  },
};
</script>

<style lang='sass' scoped>

@import '../styles/vars.sass'
@import '../styles/mixins.sass'

.c-day
  position: relative
  min-height: $day-min-height
  height: 100%
  // transition: all $day-content-transition-time
  z-index: 1
  &:not(.in-month) /deep/ > *
    opacity: 0

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

.c-day-content
  display: flex
  justify-content: center
  align-items: center
  width: $day-content-width
  height: $day-content-height
  border-radius: $day-content-border-radius
  transition: all $day-content-transition-time
  user-select: none
  margin: .1rem auto
  cursor: pointer
  &:focus
    border: 1px solid #dadada

.c-day-backgrounds
  overflow: hidden
  pointer-events: none
  z-index: -1
  backface-visibility: hidden // Prevents glitches in Chrome by forcing hardware acceleration

.c-day-background
  transition: height $background-transition-time

.c-day-dots
  +box()

.c-day-dot
  width: $dot-diameter
  height: $dot-diameter
  border-radius: $dot-border-radius
  transition: all $day-content-transition-time
  &:not(:last-child)
    margin-right: $dot-spacing

.c-day-bars
  +box(flex-start)
  width: $bars-width

.c-day-bar
  flex-grow: 1
  height: $bar-height
  transition: all $day-content-transition-time

</style>
