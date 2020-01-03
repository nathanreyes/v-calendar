<template>
  <div class="example">
    <v-date-picker v-model="date" :input-debounce="500"/>
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

