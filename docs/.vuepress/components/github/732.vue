<template>
  <div class="flex flex-col">
    <v-date-picker
      v-model="date"
      is-range
      :min-date="minDate"
      :max-date="maxDate"
      @drag="onDrag"
      @input="clearMinMaxDate"
    />
  </div>
</template>

<script>
export default {
  githubTitle:
    'Is there a way to disable dates in a range picker based on the first date selected?',
  data() {
    return {
      date: null,
      minDate: null,
      maxDate: null,
    };
  },
  methods: {
    onDrag(dragValue) {
      if (!this.minDate) {
        const minDate = new Date(dragValue.start);
        const maxDate = new Date(dragValue.start);
        minDate.setDate(minDate.getDate() - 30);
        maxDate.setDate(maxDate.getDate() + 30);
        this.minDate = minDate;
        this.maxDate = maxDate;
      }
    },
    clearMinMaxDate() {
      this.minDate = null;
      this.maxDate = null;
    },
  },
};
</script>
