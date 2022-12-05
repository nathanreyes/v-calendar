<template>
  <div class="py-6">
    <CalendarGrid
      :events="events"
      v-model:view="view"
      show-weeknumbers
      @event-create-begin="onEventCreateBegin"
      @event-create-end="onEventCreateEnd"
      @event-resize-begin="onEventResizeBegin"
      @event-resize-update="onEventResizeUpdate"
      @event-resize-end="onEventResizeEnd"
      @event-move-begin="onEventMoveBegin"
      @event-move-update="onEventMoveUpdate"
      @event-move-end="onEventMoveEnd"
      @event-remove="onEventRemove"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  setup() {
    const view = ref('monthly');

    const events = ref([
      {
        key: 1,
        summary: 'Hello',
        start: new Date(2022, 10, 28),
        end: new Date(2022, 10, 30),
      },
      {
        key: 2,
        summary: 'Hello 2',
        start: new Date(2022, 10, 30),
        end: new Date(2022, 11, 2),
      },
      {
        key: 3,
        summary: 'Hello 3',
        start: new Date(2022, 11, 2),
        end: new Date(2022, 11, 2),
        color: 'green',
      },
      {
        key: 4,
        summary: 'Hello 4',
        start: new Date(2022, 11, 3),
        end: new Date(2022, 11, 5),
      },
      {
        key: 5,
        summary: 'Hello 5',
        start: new Date(2022, 11, 6),
        end: new Date(2022, 11, 8),
      },
    ]);
    const colors = [
      'indigo',
      'red',
      'purple',
      'yellow',
      'green',
      'blue',
      'orange',
      'gray',
    ];
    return {
      view,
      events,
      onEventCreateBegin({ event }) {
        event.summary = `Event ${events.value.length + 1}`;
        event.color = colors[events.value.length % colors.length];
      },
      onEventCreateEnd({ event }) {
        events.value.push({
          key: event.key,
          summary: event.summary,
          // color: event.color,
          start: event.startDate,
          end: event.endDate,
          // popover: {
          //   placement: 'right',
          // },
        });
      },
      onEventResizeBegin({ event }) {
        const evt = events.value.find(e => e.key === event.key);
        if (evt) {
          // evt.range = event.range;
          console.log('set date to', event);
        }
      },
      onEventResizeUpdate(ev) {
        // console.log('event-resize-update');
      },
      onEventResizeEnd(ev) {
        // console.log('event-resize-end', ev);
      },
      onEventMoveBegin(ev) {
        // console.log('event-move-begin', ev);
      },
      onEventMoveUpdate(ev) {
        // console.log('event-move-update', ev);
        // const event = events.value.find(e => e.key === ev.key);
        // if (event) {
        //   event.range = ev.range;
        // }
      },
      onEventMoveEnd(ev) {
        // console.log('event-move-end', ev);
      },
      onEventRemove({ event }) {
        const idx = events.value.findIndex(e => e.key === event.key);
        if (idx >= 0) {
          events.value.splice(idx, 1);
        }
      },
    };
  },
});
</script>
