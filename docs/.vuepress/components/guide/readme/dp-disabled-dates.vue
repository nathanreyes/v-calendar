<template>
  <div class="example">
    <v-date-picker mode="range" v-model="date" :disabled-dates="{ weekdays: [1, 7] }" is-inline></v-date-picker>
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