<template>
  <v-date-picker
    mode='single'
    tint-color='#ff6666'
    v-model='selectedDate'
    :style='wrapperStyle'
    :header-style='headerStyle'
    :header-divider-color='headerDividerColor'
    :weekday-style='weekdayStyle'
    :weeks-style='weeksStyle'
    :weekday-divider-color='headerDividerColor'
    is-double-paned
    is-inline>
  </v-date-picker>
</template>

<script>
export default {
  data() {
    return {
      selectedDate: null,
      wrapperStyle: {
        border: '0',
      },
      headerStyle: {
        color: '#fafafa',
        backgroundColor: '#4a5867',
        border: 'solid #404c59',
        borderWidth: '1px 1px 0 1px',
      },
      headerDividerColor: '#404c59',
      weekdayStyle: {
        color: '#98aeb3',
        backgroundColor: '#4a5867',
        border: 'solid #384763',
        borderWidth: '0 1px',
        padding: '5px 0 10px 0',
      },
      weeksStyle: {
        border: '1px solid #dadada',
      },
    };
  },
};
</script>
