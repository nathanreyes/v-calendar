<template>
  <div class="example">
    <v-date-picker
      mode="range"
      :select-attribute="selectAttribute"
      v-model="range"
      show-caps
      is-inline
    ></v-date-picker>
  </div>
</template>

<script>
export default {
  data() {
    return {
      range: {
        start: new Date(2018, 0, 8),
        end: new Date(2018, 0, 12),
      },
      selectAttribute: {
        popover: ({ onEnd }) => ({
          visibility: onEnd ? 'visible' : 'hover',
        }),
      },
    };
  },
};
</script>
