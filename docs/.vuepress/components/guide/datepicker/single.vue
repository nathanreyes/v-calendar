<template>
  <div class="example">
    <v-date-picker v-model="date" :popover="{ visibility: 'visible' }"/>
  </div>
</template>

<script>
export default {
  data() {
    return {
      date: new Date(2018, 0, 25), // Jan 25th, 2018
    };
  },
};
</script>

