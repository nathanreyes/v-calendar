<template>
  <v-date-picker
    mode='single'
    v-model='selectedDate'
    select-color='#ff6666'
    :theme-styles='themeStyles'
    is-double-paned
    is-inline>
  </v-date-picker>
</template>

<script>
export default {
  data() {
    return {
      selectedDate: null,
      themeStyles: {
        wrapper: {
          border: '0', // Override the default border
        },
        header: {
          color: '#fafafa',
          backgroundColor: '#4a5867',
          borderColor: '#404c59',
          borderWidth: '1px 1px 0 1px',
        },
        headerVerticalDivider: {
          borderLeft: '1px solid #404c59',
        },
        weekdays: {
          color: '#98aeb3',
          backgroundColor: '#4a5867',
          borderColor: '#384763',
          borderWidth: '0 1px',
          paddingTop: '5px',
          paddingBottom: '10px',
        },
        weekdaysVerticalDivider: {
          borderLeft: '1px solid #404c59',
        },
        weeks: {
          border: '1px solid #dadada',
        },
      },
    };
  },
};
</script>
