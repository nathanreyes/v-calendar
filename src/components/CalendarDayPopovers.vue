<template>
  <!-- Popover content -->
  <div class="vc-day-popover-content" slot="popover-content">
    <!-- Day popover header slot -->
    <slot name="day-popover-header" :day="day" :attributes="day.attributes" :format="format"/>
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
      >
        <span
          v-if="popover.label"
          class="popover-label"
          :style="popover.labelStyle"
          :key="popover.key"
        >{{ popover.label }}</span>
        <component
          v-if="popover.component"
          :is="popover.component"
          :attribute="popover.attribute"
          :day-format="formats.dayPopover"
          :day="day"
          :format="format"
        ></component>
      </slot>
    </calendar-day-popover-row>
    <!-- <p class="vc-day-no-popovers" v-if="!hasPopovers">Empty</p> -->
    <!-- Day popover footer slot -->
    <slot name="day-popover-footer" :day="day" :attributes="attributes" :format="format"></slot>
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

<style scoped>
.vc-day-popover-content {
  line-height: 1.5;
  padding: 5px 0;
}
.vc-day-no-popovers {
  opacity: 0.8;
  padding: 2px 6px;
  margin: 0px;
  line-height: 1.5;
}
</style>
