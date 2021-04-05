<template>
  <v-date-picker
    v-model="range"
    is-range
    class="calendar"
    @dayclick="resetRange"
  />
</template>

<script>
export default {
  githubTitle: 'Bug date range in ui not following v-model',
  data() {
    return {
      range: null,
      resetNextDayClick: false,
    };
  },
  watch: {
    range(val) {
      if (val) {
        this.resetNextDayClick = true;
      }
    },
  },
  methods: {
    resetRange() {
      if (this.resetNextDayClick) {
        this.resetNextDayClick = false;
        this.$nextTick(() => (this.range = null));
      }
    },
  },
};
</script>
