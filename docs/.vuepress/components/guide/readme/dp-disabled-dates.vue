<template>
  <div class="example">
    <v-date-picker
      v-model="date"
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
