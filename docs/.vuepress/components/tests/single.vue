<template>
  <div class="example">
    <v-date-picker v-model="date" :select-attribute="selectAttribute" is-inline/>
  </div>
</template>

<script>
export default {
  data() {
    return {
      date: new Date(),
      popoverVisibility: 'hover',
    };
  },
  computed: {
    selectAttribute() {
      return {
        popover: {
          visibility: this.popoverVisibility,
        },
      };
    },
  },
};
</script>
