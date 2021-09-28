<template>
  <v-calendar
    :attributes="attrs"
    :masks="masks"
    :firstDayOfWeek=2
    trim-weeks
  />
</template>

<script>
export default {
  props: {},
  data() {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() - 1;
    const masks = {
      title: "YYYY MMM",
      dayPopover: 'YYYY-MM-DD',
      navMonths: 'MMM'
    }
    return {
      masks,
      attrs: [
        {
          highlight: {
            color: 'blue',
            class: '#8AE6F2',
            style: {
              borderRadius: '3px',
              borderColor: '#8AE6F2',
              borderStyle: 'solid',
              borderWidth: '14px'
            },
            contentStyle: {
              backgroundColor: '#8AE6F2',
            },
          },
          dates: [
            new Date(year, month, 13),
            new Date(year, month, 14),
            new Date(year, month, 15),
            new Date(year, month, 16),
            new Date(year, month, 17),
            new Date(year, month, 18),
            new Date(year, month, 19),
            new Date(year, month, 20),
            new Date(year, month, 21),
            new Date(year, month, 22),
            new Date(year, month, 23),
            new Date(year, month, 24),
            new Date(year, month, 25),
            new Date(year, month, 26),
            new Date(year, month, 27),
            new Date(year, month, 28),
          ],
          mileages: [
            { date: new Date(year, month, 13), price: 100 },
            { date: new Date(year, month, 14), price: 140 },
            { date: new Date(year, month, 15), price: 50 },
            { date: new Date(year, month, 16), price: 100 },
            { date: new Date(year, month, 17), price: 100 },
            { date: new Date(year, month, 18), price: 140 },
            { date: new Date(year, month, 19), price: 50 },
            { date: new Date(year, month, 20), price: 100 },
            { date: new Date(year, month, 21), price: 140 },
            { date: new Date(year, month, 22), price: 150 },
            { date: new Date(year, month, 23), price: 100 },
            { date: new Date(year, month, 24), price: 100 },
            { date: new Date(year, month, 25), price: 140 },
            { date: new Date(year, month, 26), price: 50 },
            { date: new Date(year, month, 27), price: 500 },
          ]
        },
        {
          dot:'blue',
          dates: [
            {start:new Date(year, month, 16), end: new Date(year, month, 23)}
          ]
        },
        // {
        //   dot:'red',
        //   dates: [
        //     new Date(year, month, 12)
        //   ]
        // }
        {
          key: 'today',
          highlight: {
            fillMode: 'outline',
            style: {
              borderColor: '#8AE6F2',
              border: '2px solid',
              borderRadius: '5px',
            }
          },
          dates: new Date(year, month, 28),
        },
      ],
    }
  },
  watch: {},

}
</script>
