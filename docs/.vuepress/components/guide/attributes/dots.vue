<template>
  <div class="example">
    <v-calendar
      :columns="$screens({ lg: 2 }, 1)"
      :from-date="new Date(2018, 0, 1)"
      :attributes="attributes"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      attributes: [
        {
          dot: 'red',
          dates: [
            new Date(2018, 0, 1), // Jan 1st
            new Date(2018, 0, 10), // Jan 10th
            new Date(2018, 0, 22), // Jan 22nd
            new Date(2018, 1, 6), // Feb 6th
            new Date(2018, 1, 16), // Feb 16th
          ],
        },
        {
          dot: 'cyan',
          dates: [
            new Date(2018, 0, 4), // Jan 4th
            new Date(2018, 0, 10), // Jan 10th
            new Date(2018, 0, 15), // Jan 15th
            new Date(2018, 1, 1), // Feb 1st
            new Date(2018, 1, 12), // Feb 12th
            {
              start: new Date(2018, 1, 20), // Feb 20th
              end: new Date(2018, 1, 25), // - Feb 25th
            },
          ],
        },
        {
          dot: 'purple',
          dates: [
            new Date(2018, 0, 12), // Jan 12th
            new Date(2018, 0, 26), // Jan 26th
            new Date(2018, 0, 15), // Jan 15th
            new Date(2018, 1, 5), // Feb 5th
            new Date(2018, 1, 6), // Feb 6th
            new Date(2018, 1, 9), // Feb 9th
            new Date(2018, 1, 20), // Feb 20th
            new Date(2018, 1, 25), // Feb 25th
          ],
        },
      ],
    };
  },
};
</script>
