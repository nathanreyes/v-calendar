<template>
  <div class="example">
    <v-date-picker v-model="date" :min-date="minDate" :max-date="maxDate" />
  </div>
</template>

<script>
export default {
  props: {
    isMin: Boolean,
  },
  data() {
    return {
      date: new Date(),
    };
  },
  computed: {
    minDate() {
      return this.isMin ? new Date() : null;
    },
    maxDate() {
      return this.isMin ? null : new Date();
    },
  },
};
</script>
