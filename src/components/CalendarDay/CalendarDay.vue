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
import { PropType, defineComponent, computed, watch } from 'vue';
import { useCalendar } from '../../use/calendar';
import { CalendarDay } from '../../utils/locale';
import { DayAttribute, PopoverConfig } from '../../utils/attribute';
import { arrayHasItems } from '../../utils/helpers';
import { popoverDirective } from '../../utils/popovers';
import { last, get, defaults } from '../../utils/_';

export default defineComponent({
  directives: { popover: popoverDirective },
  props: {
    day: { type: Object as PropType<CalendarDay>, required: true },
  },
  setup(props, { slots }) {
    const {
      locale,
      theme,
      dayAttributes,
      dayPopoverId,
      onDayClick,
      onDayMouseenter,
      onDayMouseleave,
      onDayFocusin,
      onDayFocusout,
      onDayKeydown,
    } = useCalendar();

    const day = computed(() => props.day);
    const attributes = computed(() => dayAttributes.value[day.value.id] || []);

    function processPopover(
      attribute: DayAttribute,
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

    const glyphs = computed<any>(() => {
      const result = {
        ...theme.prepareRender({}),
        popovers: [],
      };
      attributes.value.forEach(attr => {
        const dayContext = attr.dayDates[0].getDayContext(day.value);
        theme.render(attr, dayContext, result);
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
      } else {
        tabindex = '-1';
      }
      const classes = [
        'vc-day-content vc-focusable vc-attr',
        { 'vc-disabled': day.value.isDisabled },
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
