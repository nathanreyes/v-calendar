<template>
  <div class="example">
    <v-calendar :from-date="fromDate" :attributes="attrs"/>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fromDate: new Date(2018, 0, 1),
      attrs: [
        {
          dot: 'red',
          dates: {
            start: new Date('1/1/2018'),
            monthlyInterval: 2, // Every other month
            ordinalWeekdays: { [-1]: 6 }, // ...on the last Friday
          },
        },
      ],
    };
  },
};
</script>