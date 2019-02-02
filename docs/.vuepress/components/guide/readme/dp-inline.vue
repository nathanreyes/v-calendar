<template>
  <div class="example">
    <v-date-picker v-model="date" is-inline/>
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
