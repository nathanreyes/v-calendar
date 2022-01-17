<template>
  <div class="vc-day" :class="dayClasses">
    <!--Highlights-->
    <div v-if="hasHighlights" class="vc-highlights vc-day-layer">
      <div
        v-for="{ key, wrapperClass, class: bgClass, style } in highlights"
        :key="key"
        :class="wrapperClass"
      >
        <div :class="bgClass" :style="style" />
      </div>
    </div>
    <!--Content-->
    <slot
      name="day-content"
      :day="day"
      :attributes="attributes"
      :dayProps="dayContentProps"
      :dayEvents="dayContentEvents"
      :locale="locale"
    >
      <span v-bind="dayContentProps" v-popover="dayPopover">
        {{ day.label }}
      </span>
    </slot>
    <!--Dots-->
    <div v-if="hasDots" class="vc-day-layer vc-day-box-center-bottom">
      <div class="vc-dots">
        <span
          v-for="{ key, class: bgClass, style } in dots"
          :key="key"
          :class="bgClass"
          :style="style"
        />
      </div>
    </div>
    <!--Bars-->
    <div v-if="hasBars" class="vc-day-layer vc-day-box-center-bottom">
      <div class="vc-bars">
        <span
          v-for="{ key, class: bgClass, style } in bars"
          :key="key"
          :class="bgClass"
          :style="style"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useCalendarContext } from '../../use/calendar';
import { CalendarDay } from '../../utils/locale';
import { Attribute, DayAttribute, PopoverConfig } from '../../utils/attribute';
import { arrayHasItems } from '../../utils/helpers';
import { popoverDirective } from '../../utils/popovers';
import { last, get, defaults } from '../../utils/_';

export default defineComponent({
  directives: { popover: popoverDirective },
  props: {
    day: { type: Object, required: true },
  },
  setup(props, { slots }) {
    const {
      locale,
      dayAttributes,
      dayPopoverId,
      onDayClick,
      onDayMouseenter,
      onDayMouseleave,
      onDayFocusin,
      onDayFocusout,
      onDayKeydown,
    } = useCalendarContext();

    const day = computed(() => props.day as CalendarDay);
    const attributes = computed(() => dayAttributes.value[day.value.id] || []);

    function processHighlight(
      { key, highlight }: Attribute,
      {
        isDate,
        hasRecurrence,
        onStart,
        onEnd,
        onStartAndEnd,
      }: {
        isDate: boolean;
        hasRecurrence: boolean;
        onStart: boolean;
        onEnd: boolean;
        onStartAndEnd: boolean;
      },
      { highlights, content },
    ) {
      if (!highlight) return;
      const { base, start, end } = highlight;
      if (isDate || hasRecurrence) {
        highlights.push({
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
        highlights.push({
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
        highlights.push({
          key: `${key}-base`,
          wrapperClass: 'vc-day-layer vc-day-box-right-center',
          class: ['vc-highlight vc-highlight-base-start', base.class],
          style: base.style,
        });
        highlights.push({
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
        highlights.push({
          key: `${key}-base`,
          wrapperClass: 'vc-day-layer vc-day-box-left-center',
          class: ['vc-highlight vc-highlight-base-end', base.class],
          style: base.style,
        });
        highlights.push({
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
        highlights.push({
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
    }

    function processNonHighlight(
      attr: DayAttribute,
      itemKey,
      { isDate, onStart, onEnd },
      list,
    ) {
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
    }

    function processPopover(
      attribute: Attribute,
      { popovers }: { popovers: PopoverConfig[] },
    ) {
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
    }

    const glyphs = computed(() => {
      const result = {
        highlights: [],
        dots: [],
        bars: [],
        popovers: [],
        content: [],
      };
      attributes.value.forEach(attr => {
        const dayRange = day.value.range;
        const targetDate = attr.dayDates[0];
        const { isDate, hasRecurrence, start, end } = targetDate;
        const startTime = start ? start.dateTime : null;
        const endTime = end ? end.dateTime : null;
        const onStart = startTime
          ? dayRange.start.getTime() <= startTime
          : false;
        const onEnd = endTime ? dayRange.end.getTime() >= endTime : false;
        const onStartAndEnd = onStart && onEnd;
        const onStartOrEnd = onStart || onEnd;
        const dateInfo = {
          isDate,
          hasRecurrence,
          onStart,
          onEnd,
          onStartAndEnd,
          onStartOrEnd,
        };
        processHighlight(attr, dateInfo, result);
        processNonHighlight(attr, 'content', dateInfo, result.content);
        processNonHighlight(attr, 'dot', dateInfo, result.dots);
        processNonHighlight(attr, 'bar', dateInfo, result.bars);
        processPopover(attr, result);
      });
      return result;
    });

    const highlights = computed(() => glyphs.value.highlights);
    const hasHighlights = computed(() => !!arrayHasItems(highlights.value));

    const dots = computed(() => glyphs.value.dots);
    const hasDots = computed(() => !!arrayHasItems(dots.value));

    const bars = computed(() => glyphs.value.bars);
    const hasBars = computed(() => !!arrayHasItems(bars.value));

    const popovers = computed(() => glyphs.value.popovers);

    const dayClasses = computed(() => {
      return [
        'vc-day',
        ...day.value.classes,
        { 'vc-day-box-center-center': !slots['day-content'] },
        { 'is-not-in-month': !props.day.inMonth },
      ];
    });

    const dayContentEvents = computed(() => {
      return {
        onClick(event: MouseEvent) {
          onDayClick(day.value, event);
        },
        onMouseenter(event: MouseEvent) {
          onDayMouseenter(day.value, event);
        },
        onMouseleave(event: MouseEvent) {
          onDayMouseleave(day.value, event);
        },
        onFocusin(event: FocusEvent) {
          onDayFocusin(day.value, event);
        },
        onFocusout(event: FocusEvent) {
          onDayFocusout(day.value, event);
        },
        onKeydown(event: KeyboardEvent) {
          onDayKeydown(day.value, event);
        },
      };
    });

    const dayContentProps = computed(() => {
      let tabindex;
      if (day.value.isFocusable) {
        tabindex = '0';
      } else if (day.value.inMonth) {
        tabindex = '-1';
      }
      const classes = [
        'vc-day-content vc-focusable',
        { 'is-disabled': day.value.isDisabled },
        get(last(glyphs.value.content), 'class') || '',
      ];
      const style = get(last(glyphs.value.content), 'style');
      return {
        class: classes,
        style,
        tabindex,
        'aria-label': day.value.ariaLabel,
        'aria-disabled': day.value.isDisabled ? 'true' : 'false',
        role: 'button',
        ...dayContentEvents.value,
      };
    });

    const dayPopover = computed(() => {
      if (!arrayHasItems(popovers.value)) return null;
      return defaults(
        {
          id: dayPopoverId.value,
          // data: { day: day.value, attributes: attributes.value },
          data: { day, attributes },
        },
        ...popovers.value,
      );
    });

    return {
      locale,
      dayClasses,
      dayContentProps,
      dayContentEvents,
      dayPopover,
      attributes,
      highlights,
      hasHighlights,
      dots,
      hasDots,
      bars,
      hasBars,
    };
  },
});
</script>

<style lang="css">
@import './calendar-day.css';
</style>
