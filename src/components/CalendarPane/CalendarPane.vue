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
        <div v-for="(wl, i) in page.weekdayLabels" :key="i" class="vc-weekday">
          {{ wl }}
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
import { PropType } from 'vue';
import CalendarDay from '../CalendarDay/CalendarDay.vue';
import CalendarHeader from '../CalendarHeader/CalendarHeader.vue';
import { useCalendar } from '../../use/calendar';
import { Page } from '../../utils/page';

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
