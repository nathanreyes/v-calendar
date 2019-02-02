<template>
  <div class="example">
    <v-date-picker mode="range" :select-attribute="selectAttribute" v-model="range" is-inline/>
  </div>
</template>

<script>
export default {
  data() {
    return {
      range: {
        start: new Date(2018, 0, 1),
        end: new Date(2018, 0, 6),
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

