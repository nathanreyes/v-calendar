<template>
  <Calendar :view="view_" ref="calendar">
    <template #default="{ page, locale }">
      <CalendarGridChild
        :page="page"
        :locale="locale"
        @day-header-click="onDayHeaderClick"
        @will-create-event="$emit('will-create-event', $event)"
        @did-create-event="$emit('did-create-event', $event)"
        @will-resize-event="$emit('will-resize-event', $event)"
        @did-resize-event="$emit('did-resize-event', $event)"
        @will-move-event="$emit('will-move-event', $event)"
        @did-move-event="$emit('did-move-event', $event)"
      />
    </template>
  </Calendar>
</template>

<script>
import Calendar from '../Calendar/Calendar.vue';
import CalendarGridChild from './CalendarGridChild.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  components: { Calendar, CalendarGridChild },
  props: {
    view: String,
  },
  computed: {
    view_: {
      get() {
        return this.view;
      },
      set(val) {
        this.$emit('update:view', val);
      },
    },
  },
  methods: {
    onDayHeaderClick(day) {
      this.view_ = 'daily';
      this.$nextTick(() => {
        this.$refs.calendar.move(day);
      });
    },
  },
});
</script>
