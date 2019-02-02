<template>
  <div class="example">
    <v-date-picker v-model="date" :min-date="new Date()" is-inline></v-date-picker>
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
