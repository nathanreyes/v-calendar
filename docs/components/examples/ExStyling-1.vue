<template>
  <v-date-picker
    mode='single'
    tint-color='#ff6666'
    v-model='selectedDate'
    :theme-styles='themeStyles'
    :monthLabels='monthsInSpanish'
    :weekdayLabels='weekdaysInSpanish'
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
          border: '0',
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
          padding: '5px 0 10px 0',
        },
        weekdaysVerticalDivider: {
          borderLeft: '1px solid #404c59',
        },
        weeks: {
          border: '1px solid #dadada',
        },
      },
      weekdaysInSpanish: ['L', 'M', 'M', 'J', 'V', 'S', 'D'],
      monthsInSpanish: [
        'Enero',
        'Febrero',
        'Marzo',
        'Abril',
        'Mayo',
        'Junio',
        'Julio',
        'Agosto',
        'Septiembre',
        'Octubre',
        'Noviembre',
        'Diciembre',
      ],
    };
  },
};
</script>
