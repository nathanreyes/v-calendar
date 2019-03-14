<template>
  <!-- Popover content -->
  <div slot="popover-content">
    <!-- Day popover header slot -->
    <slot
      name="day-popover-header"
      :day="day"
      :attributes="day.attributes"
      :format="format"
      :update-layout="updateLayout"
      :hide="hide"
    >
      <span :class="theme.dayPopoverHeader">{{ format(day.date, formats.dayPopover) }}</span>
    </slot>
    <!-- Content row slots -->
    <calendar-day-popover-row
      v-for="popover in popovers"
      :key="popover.key"
      :attribute="popover.attribute"
      :hide-indicator="popover.hideIndicator"
    >
      <slot
        :name="popover.slot"
        :attribute="popover.attribute"
        :custom-data="popover.attribute.customData"
        :day="day"
        :format="format"
        :update-layout="updateLayout"
        :hide="hide"
      >
        <span
          v-if="popover.label"
          class="popover-label"
          :style="popover.labelStyle"
          :key="popover.key"
        >{{ popover.label }}</span>
        <component
          v-else-if="popover.component"
          :is="popover.component"
          :attribute="popover.attribute"
          :day-format="formats.dayPopover"
          :day="day"
          :format="format"
          :update-layout="updateLayout"
          :hide="hide"
        />
      </slot>
    </calendar-day-popover-row>
    <!-- Day popover footer slot -->
    <slot
      name="day-popover-footer"
      :day="day"
      :attributes="attributes"
      :format="format"
      :update-layout="updateLayout"
      :hide="hide"
    ></slot>
  </div>
</template>

<script>
import CalendarDayPopoverRow from './CalendarDayPopoverRow';
import { arrayHasItems } from '@/utils/helpers';
import { childMixin } from '@/utils/mixins';

export default {
  components: {
    CalendarDayPopoverRow,
  },
  mixins: [childMixin],
  props: {
    day: { type: Object, required: true },
    updateLayout: Function,
    hide: Function,
  },
  computed: {
    popovers() {
      return this.day.popovers;
    },
    attributes() {
      return this.day.attributes;
    },
    hasPopovers() {
      return !!arrayHasItems(this.popovers);
    },
  },
};
</script>
