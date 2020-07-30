<template>
  <div class="example">
    <v-date-picker
      v-model="range"
      :select-attribute="selectDragAttribute"
      :drag-attribute="selectDragAttribute"
      is-range
      @drag="dragValue = $event"
    >
      <template v-slot:day-popover="{ format }">
        <div>
          {{ format(dragValue ? dragValue.start : range.start, 'MMM D') }}
          -
          {{ format(dragValue ? dragValue.end : range.end, 'MMM D') }}
        </div>
      </template>
    </v-date-picker>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dragValue: null,
      range: {
        start: new Date(2018, 0, 8),
        end: new Date(2018, 0, 12),
      },
    };
  },
  computed: {
    selectDragAttribute() {
      return {
        popover: {
          visibility: 'hover',
          isInteractive: false,
        },
      };
    },
  },
};
</script>
