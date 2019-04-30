<template>
  <div class="example">
    <v-date-picker class="flex-grow w-full" mode="multiple" v-model="dates"/>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dates: [
        new Date(2018, 0, 1), // Jan 1st, 2018
        new Date(2018, 0, 15), // Jan 15th, 2018
        new Date(2018, 0, 29), // Jan 29th, 2018
      ],
    };
  },
};
</script>

