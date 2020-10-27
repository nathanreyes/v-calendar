<template>
  <div class="example">
    <v-calendar :from-date="fromDate" :attributes="attrs" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      fromDate: new Date(2018, 0, 1),
      attrs: [
        {
          key: 'today',
          highlight: {
            color: 'orange',
            fillMode: 'light',
          },
          dates: [
            new Date(2018, 0, 1),
            { start: new Date(2018, 0, 10), end: new Date(2018, 0, 12) },
            new Date(2018, 0, 15),
          ],
        },
      ],
    };
  },
};
</script>
