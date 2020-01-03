<template>
  <v-date-picker v-model="range" mode="range" :min-date="minDate" is-inline/>
</template>

<script>
export default {
  data() {
    return {
      range: null,
      minDate: new Date(),
    };
  },
};
</script>
