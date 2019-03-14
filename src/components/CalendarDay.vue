<script>
import PopoverRef from './PopoverRef';
import { childMixin } from '@/utils/mixins';
import { arrayHasItems, objectFromArray } from '@/utils/helpers';
import { isFunction, some, last, get } from '@/utils/_';

export default {
  name: 'CalendarDay',
  mixins: [childMixin],
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
                this.theme.dayContent,
                { 'vc-is-dark': this.theme.isDark },
              ],
              attrs: { ...this.dayContentProps },
              on: this.dayContentEvents,
              ref: 'content',
            },
            [h('span', { class: this.dayContentClass }, [this.day.label])],
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
  props: {
    day: { type: Object, required: true },
    attributes: Object,
  },
  data() {
    return {
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
    backgrounds() {
      return this.glyphs.backgrounds;
    },
    hasBackgrounds() {
      return !!arrayHasItems(this.backgrounds);
    },
    content() {
      return this.glyphs.content;
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
      return get(last(this.content), 'class');
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
        el: this.$refs.content,
        attributes: this.attributesList,
        attributesMap: this.attributesMap,
        popovers: this.popovers,
      };
    },
  },
  watch: {
    attributesList() {
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
      this.$emit('daymouseover', this.getDayEvent(e));
    },
    mouseleave(e) {
      this.$emit('daymouseleave', this.getDayEvent(e));
    },
    focusin(e) {
      this.$emit('dayfocusin', this.getDayEvent(e));
    },
    focusout(e) {
      this.$emit('dayfocusout', this.getDayEvent(e));
    },
    refreshGlyphs() {
      const glyphs = {
        backgrounds: [],
        dots: [],
        bars: [],
        popovers: [],
        content: [],
      };
      if (arrayHasItems(this.attributesList)) {
        this.attributesList.forEach(attr => {
          // Add glyphs for each attribute
          const { targetDate } = attr;
          const { isDate, isComplex, startTime, endTime } = targetDate;
          const onStart = startTime === this.dateTime;
          const onEnd = endTime === this.dateTime;
          const onStartAndEnd = onStart && onEnd;
          const onStartOrEnd = onStart || onEnd;
          const dateInfo = {
            isDate,
            isComplex,
            onStart,
            onEnd,
            onStartAndEnd,
            onStartOrEnd,
          };
          this.processHighlight(attr, dateInfo, glyphs);
          this.processContent(attr, dateInfo, glyphs);
          this.processDot(attr, dateInfo, glyphs);
          this.processBar(attr, dateInfo, glyphs);
          this.processPopover(attr, glyphs);
        });
      }
      this.glyphs = glyphs;
    },
    processHighlight(
      { key, highlight, targetDate },
      { isDate, isComplex, onStart, onEnd, onStartAndEnd },
      { backgrounds, content },
    ) {
      if (!highlight) return;
      const { base, start, end } = highlight;
      let targetArea;
      if (isDate || isComplex) {
        backgrounds.push({
          key,
          wrapperClass: 'vc-day-layer vc-day-box-center-center',
          class: `vc-highlight ${start.class}`,
        });
        content.push({
          key: `${key}-content`,
          class: start.contentClass,
        });
      } else {
        if (onStartAndEnd) {
          backgrounds.push({
            key,
            wrapperClass: 'vc-day-layer vc-day-box-center-center',
            class: `vc-highlight ${start.class}`,
          });
          content.push({
            key: `${key}-content`,
            class: start.contentClass,
          });
        } else if (onStart) {
          backgrounds.push({
            key: `${key}-base`,
            wrapperClass: 'vc-day-layer vc-day-box-right-center',
            class: `vc-highlight vc-highlight-base-start ${base.class}`,
          });
          backgrounds.push({
            key,
            wrapperClass: 'vc-day-layer vc-day-box-center-center',
            class: `vc-highlight ${start.class}`,
          });
          content.push({
            key: `${key}-content`,
            class: start.contentClass,
          });
        } else if (onEnd) {
          backgrounds.push({
            key: `${key}-base`,
            wrapperClass: 'vc-day-layer vc-day-box-left-center',
            class: `vc-highlight vc-highlight-base-end ${base.class}`,
          });
          backgrounds.push({
            key,
            wrapperClass: 'vc-day-layer vc-day-box-center-center',
            class: `vc-highlight ${end.class}`,
          });
          content.push({
            key: `${key}-content`,
            class: end.contentClass,
          });
        } else {
          backgrounds.push({
            key: `${key}-middle`,
            wrapperClass: 'vc-day-layer vc-day-box-center-center',
            class: `vc-highlight vc-highlight-base-middle ${base.class}`,
          });
          content.push({
            key: `${key}-content`,
            class: base.contentClass,
          });
        }
      }
    },
    processContent(
      { key, content },
      { isDate, onStart, onEnd },
      { content: contents },
    ) {
      if (!content) return;
      const { base, start, end } = content;
      if (isDate || onStart) {
        contents.push({
          key,
          class: start.class,
        });
      } else if (onEnd) {
        contents.push({
          key,
          class: end.class,
        });
      } else {
        contents.push({
          key,
          class: base.class,
        });
      }
    },
    processDot({ key, dot }, { isDate, onStart, onEnd }, { dots }) {
      if (!dot) return;
      const { base, start, end } = dot;
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
    },
    processBar({ key, bar }, { isDate, onStart, onEnd }, { bars }) {
      if (!bar) return;
      const { base, start, end } = bar;
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
    },
    processPopover(attribute, { popovers }) {
      if (!attribute.popover) return;
      const {
        label,
        labelStyle,
        component,
        slot,
        hideIndicator,
        visibility,
        isInteractive,
      } = attribute.popover;
      popovers.splice(0, 0, {
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
      });
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
  transition: all $day-content-transition-time
  user-select: none
  margin: .1rem auto
  &:hover
    background-color: hsla(211, 13%, 65%, 0.2)
    &.vc-is-dark
      background-color: hsla(209, 14%, 37%, 0.4)
  &:focus
    background-color: hsla(211, 13%, 65%, 0.4)
    &.vc-is-dark
      background-color: hsla(209, 14%, 37%, 0.7)

.vc-highlights
  overflow: hidden
  pointer-events: none
  z-index: -1

.vc-highlight
  width: 1.8rem
  height: 1.8rem
  &.vc-highlight-base-start
    width: 50% !important
    border-radius: 0 !important
    border-right-width: 0 !important
  &.vc-highlight-base-end
    width: 50% !important
    border-radius: 0 !important
    border-left-width: 0 !important
  &.vc-highlight-base-middle
    width: 100%
    border-radius: 0 !important
    border-left-width: 0 !important
    border-right-width: 0 !important
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
