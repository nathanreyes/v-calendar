<template>
  <div class="example">
    <v-calendar :from-date="fromDate" :attributes="attrs"></v-calendar>
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
          highlight: true,
          dates: [
            { start: new Date(2018, 0, 1), end: new Date(2018, 0, 5) },
            { start: new Date(2018, 0, 15), span: 5 }, // # of days
          ],
        },
      ],
    };
  },
};
</script>