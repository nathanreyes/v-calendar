<template>
  <div class="example">
    <v-date-picker
      v-model="date"
      :min-date="new Date(2018, 0, 1)"
      :max-date="new Date(2018, 1, 28)"
      :disabled-dates="{ weekdays: [1, 7] }"
      is-range
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      date: null,
    };
  },
};
</script>
