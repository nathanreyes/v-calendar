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
            class: 'vc-highlights vc-day-layer',
          },
          this.backgrounds.map(({ key, wrapperClass, class: bgClass }) =>
            h(
              'div',
              {
                key: key,
                class: wrapperClass,
              },
              [
                h('div', {
                  class: bgClass,
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
              class: [
                'vc-day-content',
                this.dayContentClass,
                this.theme.dayContent,
              ],
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
            class: 'vc-day-layer vc-day-box-center-bottom',
          },
          [
            h(
              'div',
              {
                class: 'vc-dots',
              },
              this.dots.map(({ key, class: bgClass }) => {
                return h('span', {
                  class: bgClass,
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
            class: 'vc-day-layer vc-day-box-center-bottom',
          },
          [
            h(
              'div',
              {
                class: 'vc-bars',
              },
              this.bars.map(({ key, class: bgClass }) => {
                return h('span', {
                  class: bgClass,
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
          'vc-day',
          ...this.day.classes,
          { 'vc-day-box-center-center': !this.$scopedSlots['day-content'] },
          { [this.theme.dayNotInMonth]: !this.inMonth },
        ],
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
    bars() {
      return this.glyphs.bars;
    },
    hasBars() {
      return !!arrayHasItems(this.bars);
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
            // Add dots if needed
            if (dot) dots.push(...this.getDots(attr));
            // Add bar if needed
            if (bar) bars.push(...this.getBars(attr));
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
      const { base, start, end } = this.theme.normalizeHighlight(
        highlight,
        this.theme,
      );
      let targetArea;
      if (isDate || isComplex) {
        backgrounds.push({
          key,
          wrapperClass: 'vc-day-layer vc-day-box-center-center',
          class: `vc-highlight ${start.class}`,
          contentClass: start.contentClass,
        });
      } else {
        const onStart = startTime === this.dateTime;
        const onEnd = endTime === this.dateTime;
        const onStartAndEnd = onStart && onEnd;
        const onStartOrEnd = onStart || onEnd;
        if (onStartAndEnd) {
          backgrounds.push({
            key,
            wrapperClass: 'vc-day-layer vc-day-box-center-center',
            class: `vc-highlight ${start.class}`,
            contentClass: start.contentClass,
          });
        } else if (onStart) {
          backgrounds.push({
            key,
            wrapperClass: 'vc-day-layer vc-day-box-right-center',
            class: `vc-highlight vc-highlight-start ${base.class}`,
            contentClass: base.contentClass,
          });
          backgrounds.push({
            key: `${key}-start`,
            wrapperClass: 'vc-day-layer vc-day-box-center-center',
            class: `vc-highlight ${start.class}`,
            contentClass: start.contentClass,
          });
        } else if (onEnd) {
          backgrounds.push({
            key,
            wrapperClass: 'vc-day-layer vc-day-box-left-center',
            class: `vc-highlight vc-highlight-end ${base.class}`,
            contentClass: base.contentClass,
          });
          backgrounds.push({
            key: `${key}-end`,
            wrapperClass: 'vc-day-layer vc-day-box-center-center',
            class: `vc-highlight ${end.class}`,
            contentClass: end.contentClass,
          });
        } else {
          backgrounds.push({
            key: `${key}-middle`,
            wrapperClass: 'vc-day-layer vc-day-box-center-center',
            class: `vc-highlight vc-highlight-middle ${base.class}`,
            contentClass: base.contentClass,
          });
        }
      }
      return backgrounds;
    },
    getContents({ key, content, targetDate }) {
      const contents = [];
      if (!content) return contents;

      const { isDate, startTime, endTime } = targetDate;
      const { base, start, end } = this.theme.normalizeDot(dot, this.theme);
      const onStart = startTime === this.dateTime;
      const onEnd = endTime === this.dateTime;
      if (isDate || onStart) {
        dots.push({
          key,
          class: `vc-dot ${start.class}`,
        });
      } else if (onEnd) {
        dots.push({
          key,
          class: `vc-dot ${end.class}`,
        });
      } else {
        dots.push({
          key,
          class: `vc-dot ${base.class}`,
        });
      }
      return contents;
    },
    getDots({ key, dot, targetDate }) {
      const dots = [];
      if (!dot) return dots;

      const { isDate, startTime, endTime } = targetDate;
      const { base, start, end } = this.theme.normalizeDot(dot, this.theme);
      const onStart = startTime === this.dateTime;
      const onEnd = endTime === this.dateTime;
      if (isDate || onStart) {
        dots.push({
          key,
          class: `vc-dot ${start.class}`,
        });
      } else if (onEnd) {
        dots.push({
          key,
          class: `vc-dot ${end.class}`,
        });
      } else {
        dots.push({
          key,
          class: `vc-dot ${base.class}`,
        });
      }
      return dots;
    },
    getBars({ key, bar, targetDate }) {
      const bars = [];
      if (!bar) return bars;

      const { isDate, startTime, endTime } = targetDate;
      const { base, start, end } = this.theme.normalizeBar(bar, this.theme);
      const onStart = startTime === this.dateTime;
      const onEnd = endTime === this.dateTime;
      if (isDate || onStart) {
        bars.push({
          key,
          class: `vc-bar ${start.class}`,
        });
      } else if (onEnd) {
        bars.push({
          key,
          class: `vc-bar ${end.class}`,
        });
      } else {
        bars.push({
          key,
          class: `vc-bar ${base.class}`,
        });
      }
      return bars;
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

.vc-day
  position: relative
  min-height: $day-min-height
  height: 100%
  // transition: all $day-content-transition-time
  z-index: 1

.vc-day-layer
  position: absolute
  left: 0
  right: 0
  top: 0
  bottom: 0
  pointer-events: none

.vc-day-box-center-center
  +box()
  height: 100%
  transform-origin: 50% 50%

.vc-day-box-left-center
  +box(flex-start)
  height: 100%
  transform-origin: 0% 50%

.vc-day-box-right-center
  +box(flex-end)
  height: 100%
  transform-origin: 100% 50%

.vc-day-box-center-bottom
  +box(center, flex-end)

.vc-day-content
  display: flex
  justify-content: center
  align-items: center
  width: $day-content-width
  height: $day-content-height
  border-radius: $day-content-border-radius
  transition: all $day-content-transition-time
  user-select: none
  margin: .1rem auto

.vc-highlights
  overflow: hidden
  pointer-events: none
  z-index: -1
  backface-visibility: hidden // Prevents glitches in Chrome by forcing hardware acceleration

.vc-highlight
  width: 1.8rem
  height: 1.8rem
  border-radius: 50%
  transition: height $background-transition-time
  &.vc-highlight-start
    width: 50%
    border-radius: 0
  &.vc-highlight-end
    width: 50%
    border-radius: 0
  &.vc-highlight-middle
    width: 100%
    border-radius: 0
    margin: 0 -1px
  &.vc-highlight-drag
    height: 1.75rem

.vc-dots
  +box()

.vc-dot
  width: $dot-diameter
  height: $dot-diameter
  border-radius: $dot-border-radius
  transition: all $day-content-transition-time
  &:not(:last-child)
    margin-right: $dot-spacing

.vc-bars
  +box(flex-start)
  width: $bars-width

.vc-bar
  flex-grow: 1
  height: $bar-height
  transition: all $day-content-transition-time

</style>
