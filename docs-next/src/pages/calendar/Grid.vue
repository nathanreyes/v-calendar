<template>
  <div class="py-6">
    <CalendarGrid
      :attributes="attributes"
      v-model:view="view"
      show-weeknumbers
      @will-create-event="onWillCreateEvent"
      @did-create-event="onDidCreateEvent"
      @did-resize-event="onDidResizeEvent"
      @did-move-event="onDidMoveEvent"
      @remove-event="onRemoveEvent"
    />
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';
import CalendarGrid from '../../../../src/components/CalendarGrid/CalendarGrid.vue';

export default defineComponent({
  components: { CalendarGrid },
  setup() {
    const view = ref('weekly');
    const attributes = ref([]);
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
      attributes,
      onWillCreateEvent(cell) {
        cell.label = `Event ${attributes.value.length + 1}`;
        cell.color = colors[attributes.value.length % colors.length];
      },
      onDidCreateEvent(cell) {
        attributes.value.push({
          key: cell.key,
          dates: cell.dateInfo,
          event: {
            label: cell.label,
            color: cell.color,
            popover: {
              placement: 'right',
            },
          },
        });
      },
      onDidResizeEvent(cell) {
        const attr = attributes.value.find(a => a.key === cell.key);
        if (attr) {
          attr.dates = cell.dateInfo;
        }
      },
      onDidMoveEvent(cell) {
        const attr = attributes.value.find(a => a.key === cell.key);
        if (attr) {
          attr.dates = cell.dateInfo;
        }
      },
      onRemoveEvent(cell) {
        const idx = attributes.value.findIndex(a => a.key === cell.key);
        if (idx >= 0) {
          attributes.value.splice(idx, 1);
        }
      },
    };
  },
});
</script>
