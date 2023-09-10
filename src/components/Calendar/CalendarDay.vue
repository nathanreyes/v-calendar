<template>
  <div :class="dayClasses">
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
    <CalendarSlot
      name="day-content"
      :day="day"
      :attributes="attributes"
      :attribute-cells="attributeCells"
      :dayProps="dayContentProps"
      :dayEvents="dayContentEvents"
      :locale="locale"
    >
      <div
        v-bind="dayContentProps"
        v-on="dayContentEvents"
        v-popover="dayPopover"
      >
        {{ day.label }}
      </div>
    </CalendarSlot>
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
import { type PropType, computed, defineComponent } from 'vue';
import { useCalendar } from '../../use/calendar';
import { useSlot } from '../../use/slots';
import type { Attribute, PopoverConfig } from '../../utils/attribute';
import type { DateRangeCell } from '../../utils/date/range';
import { arrayHasItems, defaults, get, last } from '../../utils/helpers';
import type { CalendarDay } from '../../utils/page';
import { popoverDirective } from '../../utils/popovers';
import CalendarSlot from './CalendarSlot.vue';

export default defineComponent({
  directives: { popover: popoverDirective },
  components: { CalendarSlot },
  props: {
    day: { type: Object as PropType<CalendarDay>, required: true },
  },
  setup(props) {
    const {
      locale,
      theme,
      attributeContext,
      dayPopoverId,
      onDayClick,
      onDayMouseenter,
      onDayMouseleave,
      onDayFocusin,
      onDayFocusout,
      onDayKeydown,
    } = useCalendar();

    const day = computed(() => props.day);
    const attributeCells = computed(() => {
      return attributeContext.value.getCells(day.value);
    });
    const attributes = computed(() =>
      attributeCells.value.map(cell => cell.data as Attribute),
    );
    const attributedDay = computed(() => {
      return {
        ...day.value,
        attributes: attributes.value,
        attributeCells: attributeCells.value,
      };
    });

    function processPopover(
      { data: attribute }: DateRangeCell<Attribute>,
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
        ...theme.value.prepareRender({}),
        popovers: [],
      };
      attributeCells.value.forEach(cell => {
        theme.value.render(cell, result);
        processPopover(cell, result);
      });
      return result;
    });

    const highlights = computed(() => glyphs.value.highlights);
    const hasHighlights = computed(() => !!arrayHasItems(highlights.value));

    const content = computed(() => glyphs.value.content);

    const dots = computed(() => glyphs.value.dots);
    const hasDots = computed(() => !!arrayHasItems(dots.value));

    const bars = computed(() => glyphs.value.bars);
    const hasBars = computed(() => !!arrayHasItems(bars.value));

    const popovers = computed(() => glyphs.value.popovers);
    const popoverAttrs = computed(() =>
      popovers.value.map((p: any) => p.attribute),
    );

    const dayContentSlot = useSlot('day-content');
    const dayClasses = computed(() => {
      return [
        'vc-day',
        ...day.value.classes,
        { 'vc-day-box-center-center': !dayContentSlot },
        { 'is-not-in-month': !props.day.inMonth },
      ];
    });

    const dayContentProps = computed(() => {
      let tabindex;
      if (day.value.isFocusable) {
        tabindex = '0';
      } else {
        tabindex = '-1';
      }
      const classes = [
        'vc-day-content vc-focusable vc-focus vc-attr',
        { 'vc-disabled': day.value.isDisabled },
        get(last(highlights.value), 'contentClass'),
        get(last(content.value), 'class') || '',
      ];
      const style = {
        ...get(last(highlights.value), 'contentStyle'),
        ...get(last(content.value), 'style'),
      };
      return {
        class: classes,
        style,
        tabindex,
        'aria-label': day.value.ariaLabel,
        'aria-disabled': day.value.isDisabled ? true : false,
        role: 'button',
      };
    });

    const dayContentEvents = computed(() => {
      return {
        click(event: MouseEvent) {
          onDayClick(attributedDay.value, event);
        },
        mouseenter(event: MouseEvent) {
          onDayMouseenter(attributedDay.value, event);
        },
        mouseleave(event: MouseEvent) {
          onDayMouseleave(attributedDay.value, event);
        },
        focusin(event: FocusEvent) {
          onDayFocusin(attributedDay.value, event);
        },
        focusout(event: FocusEvent) {
          onDayFocusout(attributedDay.value, event);
        },
        keydown(event: KeyboardEvent) {
          onDayKeydown(attributedDay.value, event);
        },
      };
    });

    const dayPopover = computed(() => {
      if (!arrayHasItems(popovers.value)) return null;
      return defaults(
        {
          id: dayPopoverId.value,
          data: { day, attributes: popoverAttrs.value },
        },
        ...popovers.value,
      );
    });

    return {
      attributes,
      attributeCells,
      bars,
      dayClasses,
      dayContentProps,
      dayContentEvents,
      dayPopover,
      glyphs,
      dots,
      hasDots,
      hasBars,
      highlights,
      hasHighlights,
      locale,
      popovers,
    };
  },
});
</script>

<style>
.vc-day {
  position: relative;
  min-height: 32px;
  z-index: 1;
  /* &.is-not-in-month * {
    opacity: 0;
    pointer-events: none;
  } */
}

.vc-monthly .is-not-in-month * {
  opacity: 0;
  pointer-events: none;
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
  font-size: var(--vc-text-sm);
  font-weight: var(--vc-font-medium);
  width: 28px;
  height: 28px;
  line-height: 28px;
  border-radius: var(--vc-rounded-full);
  user-select: none;
  cursor: pointer;
  &:hover {
    background-color: var(--vc-day-content-hover-bg);
  }
  &.vc-disabled {
    color: var(--vc-day-content-disabled-color);
  }
}

/* ----Content---- */

.vc-content:not(.vc-base) {
  font-weight: var(--vc-font-bold);
  color: var(--vc-content-color);
}

/* ----Highlights---- */

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

.vc-highlight-bg-outline,
.vc-highlight-bg-none {
  background-color: var(--vc-highlight-outline-bg);
  border: 2px solid;
  border-color: var(--vc-highlight-outline-border);
  border-radius: var(--vc-rounded-full);
}
.vc-highlight-bg-light {
  background-color: var(--vc-highlight-light-bg);
  border-radius: var(--vc-rounded-full);
}
.vc-highlight-bg-solid {
  background-color: var(--vc-highlight-solid-bg);
  border-radius: var(--vc-rounded-full);
}

.vc-highlight-content-outline,
.vc-highlight-content-none {
  font-weight: var(--vc-font-bold);
  color: var(--vc-highlight-outline-content-color);
}
.vc-highlight-content-light {
  font-weight: var(--vc-font-bold);
  color: var(--vc-highlight-light-content-color);
}
.vc-highlight-content-solid {
  font-weight: var(--vc-font-bold);
  color: var(--vc-highlight-solid-content-color);
}

/* ----Dots---- */

.vc-dots {
  display: flex;
  justify-content: center;
  align-items: center;
}

.vc-dot {
  width: 5px;
  height: 5px;
  border-radius: 9999px;
  transition: var(--vc-day-content-transition);
  &:not(:last-child) {
    margin-right: 3px;
  }
}

/* ----Bars---- */

.vc-bars {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 75%;
}

.vc-bar {
  flex-grow: 1;
  height: 3px;
  transition: var(--vc-day-content-transition);
}

.vc-dot {
  background-color: var(--vc-dot-bg);
}
.vc-bar {
  background-color: var(--vc-bar-bg);
}
</style>
