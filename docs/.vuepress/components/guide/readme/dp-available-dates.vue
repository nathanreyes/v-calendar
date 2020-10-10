<template>
  <div class="example">
    <v-date-picker
      :available-dates="{ start: new Date(), end: null }"
      v-model="date"
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
