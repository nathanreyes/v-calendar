<template>
  <div
    :class="[
      'vc-pane',
      `row-${page.row}`,
      `row-from-end-${page.rowFromEnd}`,
      `column-${page.column}`,
      `column-from-end-${page.columnFromEnd}`,
    ]"
    ref="pane"
  >
    <CalendarHeader :page="page" is-lg hide-arrows />
    <div
      class="vc-weeks"
      :class="{
        [`vc-show-weeknumbers-${page.weeknumberPosition}`]:
          page.weeknumberPosition,
      }"
    >
      <div class="vc-weekdays">
        <!--Weekday labels-->
        <div
          v-for="({ weekday, label }, i) in page.weekdays"
          :key="i"
          :class="`vc-weekday vc-weekday-${weekday}`"
        >
          {{ label }}
        </div>
      </div>
      <!--Weeks-->
      <div
        v-for="week in page.viewWeeks"
        :key="`weeknumber-${week.weeknumber}`"
        class="vc-week"
      >
        <!--Weeknumber-->
        <div
          v-if="page.weeknumberPosition"
          :class="['vc-weeknumber', `is-${page.weeknumberPosition}`]"
        >
          <span
            :class="['vc-weeknumber-content']"
            @click="onWeeknumberClick(week, $event)"
            >{{ week.weeknumberDisplay }}</span
          >
        </div>
        <!--Week days-->
        <CalendarDay v-for="day in week.days" :key="day.id" :day="day" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import CalendarDay from '../CalendarDay/CalendarDay.vue';
import CalendarHeader from '../CalendarHeader/CalendarHeader.vue';
import { useCalendar } from '../../use/calendar';
import type { Page } from '../../utils/page';

export default {
  name: 'CalendarPane',
  inheritAttrs: false,
  components: { CalendarHeader, CalendarDay },
  props: {
    page: { type: Object as PropType<Page>, required: true },
  },
  setup() {
    const { onWeeknumberClick } = useCalendar();
    return {
      onWeeknumberClick,
    };
  },
};
</script>

<style lang="css">
.vc-pane {
  min-width: 250px;
}

.vc-weeknumber {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  &.is-left {
    left: calc(var(--vc-weeknumber-offset-inside) * -1);
  }
  &.is-right {
    right: calc(var(--vc-weeknumber-offset-inside) * -1);
  }
  &.is-left-outside {
    left: calc(var(--vc-weeknumber-offset-outside) * -1);
  }
  &.is-right-outside {
    right: calc(var(--vc-weeknumber-offset-outside) * -1);
  }
}

.vc-weeknumber-content {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: var(--vc-text-xs);
  font-weight: var(--vc-font-medium);
  font-style: italic;
  width: 28px;
  height: 28px;
  margin-top: 2px;
  color: var(--vc-weeknumber-color);
  user-select: none;
}

.vc-weeks {
  position: relative;
  /* overflow: auto; */
  -webkit-overflow-scrolling: touch;
  padding: 6px;
  min-width: 232px;
  &.vc-show-weeknumbers-left {
    margin-left: var(--vc-weeknumber-offset-inside);
  }
  &.vc-show-weeknumbers-right {
    margin-right: var(--vc-weeknumber-offset-inside);
  }
}

.vc-weekday {
  text-align: center;
  color: var(--vc-weekday-color);
  font-size: var(--vc-text-sm);
  font-weight: var(--vc-font-bold);
  line-height: 14px;
  padding-top: 4px;
  padding-bottom: 8px;
  cursor: default;
  user-select: none;
}

.vc-week,
.vc-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  position: relative;
}
</style>
