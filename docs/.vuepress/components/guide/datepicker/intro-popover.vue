<template>
  <div class="example">
    <v-date-picker v-model="date"></v-date-picker>
  </div>
</template>

<script>
export default {
  data() {
    return {
      date: new Date(),
    };
  },
};
</script>

