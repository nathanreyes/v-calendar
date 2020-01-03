<template>
  <div>
    <v-calendar :max-date="maxDate" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      maxDate: new Date(),
      disabledDates: [],
    };
  },
};
</script>