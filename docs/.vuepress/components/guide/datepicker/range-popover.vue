<template>
  <div class="example">
    <v-date-picker
      mode="range"
      v-model="range"
      :select-attribute="selectDragAttribute"
      :drag-attribute="selectDragAttribute"
      is-inline
      @drag="dragValue = $event"
    >
      <div slot="day-popover" slot-scope="{ format }">
        {{ format(dragValue ? dragValue.start : range.start, 'MMM D') }}
        -
        {{ format(dragValue ? dragValue.end : range.end, 'MMM D') }}
      </div>
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

