<template>
  <div class="py-6">
    <CalendarGrid
      :attributes="attributes"
      v-model:view="view"
      @will-create-event="onWillCreateEvent"
      @did-create-event="onDidCreateEvent"
      @did-resize-event="onDidResizeEvent"
      @did-move-event="onDidMoveEvent"
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
        cell.key = attributes.value.length + 1;
        cell.label = `Event ${cell.key}`;
        cell.color = colors[attributes.value.length % colors.length];
      },
      onDidCreateEvent(cell) {
        attributes.value.push({
          key: cell.key,
          dates: cell.dateInfo,
          event: {
            label: cell.label,
            color: cell.color,
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
    };
  },
});
</script>

<style scoped lang="postcss"></style>

<style>
.vc-container {
  border: none !important;
}
</style>
