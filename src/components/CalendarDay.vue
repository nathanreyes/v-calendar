<script>
import { childMixin, safeScopedSlotMixin } from '../utils/mixins';
import { arrayHasItems, mergeEvents } from '../utils/helpers';
import { getPopoverTriggerEvents, updatePopover } from '../utils/popovers';
import { last, get, defaults } from '../utils/_';

export default {
  name: 'CalendarDay',
  mixins: [childMixin, safeScopedSlotMixin],
  render(h) {
    // Backgrounds layer
    const backgroundsLayer = () =>
      this.hasBackgrounds &&
      h(
        'div',
        {
          class: 'vc-highlights vc-day-layer',
        },
        this.backgrounds.map(({ key, wrapperClass, class: bgClass, style }) =>
          h(
            'div',
            {
              key,
              class: wrapperClass,
            },
            [
              h('div', {
                class: bgClass,
                style,
              }),
            ],
          ),
        ),
      );

    // Content layer
    const contentLayer = () =>
      this.safeScopedSlot('day-content', {
        day: this.day,
        attributes: this.day.attributes,
        attributesMap: this.day.attributesMap,
        dayProps: this.dayContentProps,
        dayEvents: this.dayContentEvents,
      }) ||
      h(
        'span',
        {
          class: this.dayContentClass,
          style: this.dayContentStyle,
          attrs: { ...this.dayContentProps },
          on: this.dayContentEvents,
          ref: 'content',
        },
        [this.day.label],
      );

    // Dots layer
    const dotsLayer = () =>
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
            this.dots.map(({ key, class: bgClass, style }) =>
              h('span', {
                key,
                class: bgClass,
                style,
              }),
            ),
          ),
        ],
      );

    // Bars layer
    const barsLayer = () =>
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
            this.bars.map(({ key, class: bgClass, style }) =>
              h('span', {
                key,
                class: bgClass,
                style,
              }),
            ),
          ),
        ],
      );

    // Root layer
    return h(
      'div',
      {
        class: [
          'vc-day',
          ...this.day.classes,
          { 'vc-day-box-center-center': !this.$scopedSlots['day-content'] },
          { 'is-not-in-month': !this.inMonth },
        ],
      },
      [backgroundsLayer(), contentLayer(), dotsLayer(), barsLayer()],
    );
  },
  inject: ['sharedState'],
  props: {
    day: { type: Object, required: true },
  },
  data() {
    return {
      glyphs: {},
      dayContentEvents: {},
    };
  },
  computed: {
    label() {
      return this.day.label;
    },
    startTime() {
      return this.day.range.start.getTime();
    },
    endTime() {
      return this.day.range.end.getTime();
    },
    inMonth() {
      return this.day.inMonth;
    },
    isDisabled() {
      return this.day.isDisabled;
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
    dayContentClass() {
      return [
        'vc-day-content vc-focusable',
        { 'is-disabled': this.isDisabled },
        get(last(this.content), 'class') || '',
      ];
    },
    dayContentStyle() {
      return get(last(this.content), 'style');
    },
    dayContentProps() {
      let tabindex;
      if (this.day.isFocusable) {
        tabindex = '0';
      } else if (this.day.inMonth) {
        tabindex = '-1';
      }
      return {
        tabindex,
        'aria-label': this.day.ariaLabel,
        'aria-disabled': this.day.isDisabled ? 'true' : 'false',
        role: 'button',
      };
    },
    dayEvent() {
      return {
        ...this.day,
        el: this.$refs.content,
        popovers: this.popovers,
      };
    },
  },
  watch: {
    theme() {
      this.refresh();
    },
    popovers() {
      this.refreshPopovers();
    },
  },
  mounted() {
    this.refreshPopovers();
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
    mouseleave(e) {
      this.$emit('daymouseleave', this.getDayEvent(e));
    },
    focusin(e) {
      this.$emit('dayfocusin', this.getDayEvent(e));
    },
    focusout(e) {
      this.$emit('dayfocusout', this.getDayEvent(e));
    },
    keydown(e) {
      this.$emit('daykeydown', this.getDayEvent(e));
    },
    refresh() {
      if (!this.day.refresh) return;
      this.day.refresh = false;
      const glyphs = {
        backgrounds: [],
        dots: [],
        bars: [],
        popovers: [],
        content: [],
      };
      // Use $set to trigger reactivity in popovers, if needed
      this.$set(
        this.day,
        'attributes',
        Object.values(this.day.attributesMap || {}).sort(
          (a, b) => a.order - b.order,
        ),
      );
      this.day.attributes.forEach(attr => {
        // Add glyphs for each attribute
        const { targetDate } = attr;
        const { isDate, isComplex, startTime, endTime } = targetDate;
        const onStart = this.startTime <= startTime;
        const onEnd = this.endTime >= endTime;
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
        this.processNonHighlight(attr, 'content', dateInfo, glyphs.content);
        this.processNonHighlight(attr, 'dot', dateInfo, glyphs.dots);
        this.processNonHighlight(attr, 'bar', dateInfo, glyphs.bars);
        this.processPopover(attr, glyphs);
      });
      this.glyphs = glyphs;
    },
    processHighlight(
      { key, highlight },
      { isDate, isComplex, onStart, onEnd, onStartAndEnd },
      { backgrounds, content },
    ) {
      if (!highlight) return;
      const { base, start, end } = highlight;
      if (isDate || isComplex) {
        backgrounds.push({
          key,
          wrapperClass: 'vc-day-layer vc-day-box-center-center',
          class: ['vc-highlight', start.class],
          style: start.style,
        });
        content.push({
          key: `${key}-content`,
          class: start.contentClass,
          style: start.contentStyle,
        });
      } else if (onStartAndEnd) {
        backgrounds.push({
          key,
          wrapperClass: 'vc-day-layer vc-day-box-center-center',
          class: ['vc-highlight', start.class],
          style: start.style,
        });
        content.push({
          key: `${key}-content`,
          class: start.contentClass,
          style: start.contentStyle,
        });
      } else if (onStart) {
        backgrounds.push({
          key: `${key}-base`,
          wrapperClass: 'vc-day-layer vc-day-box-right-center',
          class: ['vc-highlight vc-highlight-base-start', base.class],
          style: base.style,
        });
        backgrounds.push({
          key,
          wrapperClass: 'vc-day-layer vc-day-box-center-center',
          class: ['vc-highlight', start.class],
          style: start.style,
        });
        content.push({
          key: `${key}-content`,
          class: start.contentClass,
          style: start.contentStyle,
        });
      } else if (onEnd) {
        backgrounds.push({
          key: `${key}-base`,
          wrapperClass: 'vc-day-layer vc-day-box-left-center',
          class: ['vc-highlight vc-highlight-base-end', base.class],
          style: base.style,
        });
        backgrounds.push({
          key,
          wrapperClass: 'vc-day-layer vc-day-box-center-center',
          class: ['vc-highlight', end.class],
          style: end.style,
        });
        content.push({
          key: `${key}-content`,
          class: end.contentClass,
          style: end.contentStyle,
        });
      } else {
        backgrounds.push({
          key: `${key}-middle`,
          wrapperClass: 'vc-day-layer vc-day-box-center-center',
          class: ['vc-highlight vc-highlight-base-middle', base.class],
          style: base.style,
        });
        content.push({
          key: `${key}-content`,
          class: base.contentClass,
          style: base.contentStyle,
        });
      }
    },
    processNonHighlight(attr, itemKey, { isDate, onStart, onEnd }, list) {
      if (!attr[itemKey]) return;
      const { key } = attr;
      const className = `vc-${itemKey}`;
      const { base, start, end } = attr[itemKey];
      if (isDate || onStart) {
        list.push({
          key,
          class: [className, start.class],
          style: start.style,
        });
      } else if (onEnd) {
        list.push({
          key,
          class: [className, end.class],
          style: end.style,
        });
      } else {
        list.push({
          key,
          class: [className, base.class],
          style: base.style,
        });
      }
    },
    processPopover(attribute, { popovers }) {
      const { key, customData, popover } = attribute;
      if (!popover) return;
      const resolvedPopover = defaults(
        {
          key,
          customData,
          attribute,
        },
        { ...popover },
        {
          visibility: popover.label ? 'hover' : 'click',
          placement: 'bottom',
          isInteractive: !popover.label,
        },
      );
      popovers.splice(0, 0, resolvedPopover);
    },
    refreshPopovers() {
      let popoverEvents = {};
      if (arrayHasItems(this.popovers)) {
        popoverEvents = getPopoverTriggerEvents(
          defaults({ id: this.dayPopoverId, data: this.day }, ...this.popovers),
        );
      }
      this.dayContentEvents = mergeEvents(
        {
          click: this.click,
          mouseenter: this.mouseenter,
          mouseleave: this.mouseleave,
          focusin: this.focusin,
          focusout: this.focusout,
          keydown: this.keydown,
        },
        popoverEvents,
      );
      updatePopover({
        id: this.dayPopoverId,
        data: this.day,
      });
    },
  },
};
</script>

<style lang="postcss" scoped>
.vc-day {
  position: relative;
  min-height: 32px;
  z-index: 1;
  &.is-not-in-month * {
    opacity: 0;
    pointer-events: none;
  }
}

.vc-day-layer {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  pointer-events: none;
}

.vc-day-box-center-center {
  display: flex;
  justify-content: center;
  align-items: center;
  transform-origin: 50% 50%;
}

.vc-day-box-left-center {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  transform-origin: 0% 50%;
}

.vc-day-box-right-center {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  transform-origin: 100% 50%;
}

.vc-day-box-center-bottom {
  display: flex;
  justify-content: center;
  align-items: flex-end;
}

.vc-day-content {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  width: 28px;
  height: 28px;
  line-height: 28px;
  border-radius: var(--rounded-full);
  user-select: none;
  cursor: pointer;
  &:hover {
    background-color: hsla(211, 25%, 84%, 0.3);
  }
  &:focus {
    font-weight: var(--font-bold);
    background-color: hsla(211, 25%, 84%, 0.4);
  }
  &.is-disabled {
    color: var(--gray-400);
  }
}

.vc-is-dark {
  & .vc-day-content {
    &:hover {
      background-color: hsla(216, 15%, 52%, 0.3);
    }
    &:focus {
      background-color: hsla(216, 15%, 52%, 0.4);
    }
    &.is-disabled {
      color: var(--gray-600);
    }
  }
}

.vc-highlights {
  overflow: hidden;
  pointer-events: none;
  z-index: -1;
}

.vc-highlight {
  width: 28px;
  height: 28px;
  &.vc-highlight-base-start {
    width: 50% !important;
    border-radius: 0 !important;
    border-right-width: 0 !important;
  }
  &.vc-highlight-base-end {
    width: 50% !important;
    border-radius: 0 !important;
    border-left-width: 0 !important;
  }
  &.vc-highlight-base-middle {
    width: 100%;
    border-radius: 0 !important;
    border-left-width: 0 !important;
    border-right-width: 0 !important;
    margin: 0 -1px;
  }
}

.vc-dots {
  display: flex;
  justify-content: center;
  align-items: center;
}

.vc-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  transition: all var(--day-content-transition-time);
  &:not(:last-child) {
    margin-right: 3px;
  }
}

.vc-bars {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 75%;
}

.vc-bar {
  flex-grow: 1;
  height: 3px;
  transition: all var(--day-content-transition-time);
}
</style>
