<template>
  <div class="example">
    <v-date-picker v-model="date" mode="dateTime" :minute-increment="5" />
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
