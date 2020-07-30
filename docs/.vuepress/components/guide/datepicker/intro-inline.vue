<template>
  <div class="example">
    <v-date-picker v-model="date" />
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
