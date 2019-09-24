<script>
import PopoverRef from './PopoverRef';
import { childMixin, safeScopedSlotMixin } from '@/utils/mixins';
import { arrayHasItems } from '@/utils/helpers';
import { last, get, defaults } from '@/utils/_';

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
        this.backgrounds.map(({ key, wrapperClass, class: bgClass }) =>
          h(
            'div',
            {
              key,
              class: wrapperClass,
            },
            [
              h('div', {
                class: bgClass,
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
          attrs: { ...this.dayContentProps },
          on: this.dayContentEvents,
          ref: 'content',
        },
        [this.day.label],
      );

    // Popover content wrapper
    const contentWrapperLayer = () => {
      if (!this.hasPopovers) {
        return contentLayer();
      }
      const { visibility, placement, isInteractive } = this.popoverState;
      return h(
        PopoverRef,
        {
          props: {
            id: this.dayPopoverId,
            args: this.dayEvent,
            visibility,
            placement,
            isInteractive,
          },
        },
        [contentLayer()],
      );
    };

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
            this.dots.map(({ key, class: bgClass }) =>
              h('span', {
                class: bgClass,
                key,
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
            this.bars.map(({ key, class: bgClass }) =>
              h('span', {
                class: bgClass,
                key,
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
        ],
      },
      [
        h(
          'div',
          {
            class: ['vc-h-full', { [this.theme.dayNotInMonth]: !this.inMonth }],
          },
          [backgroundsLayer(), contentWrapperLayer(), dotsLayer(), barsLayer()],
        ),
      ],
    );
  },
  inject: ['sharedState'],
  props: {
    day: { type: Object, required: true },
  },
  data() {
    return {
      glyphs: {},
      popoverState: {},
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
        get(last(this.content), 'class') || '',
        this.isDisabled ? this.theme.dayContentDisabled : '',
        this.theme.isDark ? 'vc-is-dark' : '',
        this.theme.dayContent,
      ];
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
      };
    },
    dayContentEvents() {
      return {
        click: this.click,
        mouseenter: this.mouseenter,
        mouseleave: this.mouseleave,
        focusin: this.focusin,
        focusout: this.focusout,
        keydown: this.keydown,
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
      const visibilities = ['click', 'focus', 'hover', 'visible'];
      let placement = '';
      let isInteractive = false;
      let vIdx = -1;
      this.popovers.forEach(p => {
        const vNew = visibilities.indexOf(p.visibility);
        vIdx = vNew > vIdx ? vNew : vIdx;
        placement = placement || p.placement;
        isInteractive = isInteractive || p.isInteractive;
      });
      this.popoverState = {
        visibility: vIdx >= 0 ? visibilities[vIdx] : 'hidden',
        placement: placement || 'bottom',
        isInteractive,
      };
    },
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
      this.day.attributes = Object.values(this.day.attributesMap || {}).sort(
        (a, b) => a.order - b.order,
      );
      this.day.attributes.forEach(attr => {
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
          class: `vc-highlight ${start.class}`,
        });
        content.push({
          key: `${key}-content`,
          class: start.contentClass,
        });
      } else if (onStartAndEnd) {
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
  },
};
</script>

<style lang="postcss" scoped>
.vc-day {
  position: relative;
  min-height: var(--day-min-height);
  width: 100%;
  height: 100%;
  z-index: 1;
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
  height: 100%;
  transform-origin: 50% 50%;
}

.vc-day-box-left-center {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 100%;
  transform-origin: 0% 50%;
}

.vc-day-box-right-center {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 100%;
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
  width: var(--day-content-width);
  height: var(--day-content-height);
  margin: var(--day-content-margin);
  user-select: none;
  &:hover {
    background-color: var(--day-content-bg-color-hover);
    &.vc-is-dark {
      background-color: var(--day-content-dark-bg-color-hover);
    }
  }
  &:focus {
    background-color: var(--day-content-bg-color-focus);
    &.vc-is-dark {
      background-color: var(--day-content-dark-bg-color-focus);
    }
  }
}

.vc-highlights {
  overflow: hidden;
  pointer-events: none;
  z-index: -1;
}

.vc-highlight {
  width: var(--highlight-height);
  height: var(--highlight-height);
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
  width: var(--dot-diameter);
  height: var(--dot-diameter);
  border-radius: var(--dot-border-radius);
  transition: all var(--day-content-transition-time);
  &:not(:last-child) {
    margin-right: var(--dot-spacing);
  }
}

.vc-bars {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: var(--bars-width);
}

.vc-bar {
  flex-grow: 1;
  height: var(--bar-height);
  transition: all var(--day-content-transition-time);
}
</style>
