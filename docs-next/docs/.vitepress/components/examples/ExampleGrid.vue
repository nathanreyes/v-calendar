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

<script>
import { defineComponent, ref } from 'vue';

export default defineComponent({
  setup() {
    const view = ref('monthly');
    const hourTime = 1000 * 60 * 60;
    const dayTime = hourTime * 24;
    const today = new Date();
    const one = new Date(today.getTime() + dayTime);
    const two = new Date(today.getTime() + 2 * dayTime);

    const events = ref([
      {
        key: 1,
        summary: 'Hello',
        start: today,
        end: today,
      },
      {
        key: 2,
        summary: 'Hello 2',
        start: one,
        end: two,
      },
      {
        key: 3,
        summary: 'Hello 3',
        start: today,
        end: two,
      },
      {
        key: 4,
        summary: 'Hello 4',
        start: today,
        end: new Date(today.getTime() + hourTime),
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
          color: event.color,
          start: event.startDate,
          end: event.endDate,
          popover: {
            placement: 'right',
          },
        });
      },
      onEventResizeBegin({ event }) {
        const evt = events.value.find(e => e.key === event.key);
        if (evt) {
          evt.dateInfo = event.dateInfo;
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
        //   event.dateInfo = ev.dateInfo;
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
