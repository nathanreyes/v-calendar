<template>
  <v-date-picker
    mode='range'
    v-model='selectedDate'
    :drag-color='dragColor'
    :select-color='selectColor'
    :attributes='attributes'
    :theme-styles='themeStyles'
    is-inline>
  </v-date-picker>
</template>

<script>
import { getExampleMonthComps } from '@/utils/helpers';

export default {
  data() {
    const { thisMonth, thisMonthYear } = getExampleMonthComps();
    // Show a bar for today's date
    const barDate = new Date();
    // Get start and end dates for the current week
    const startDate = new Date(thisMonthYear, thisMonth, barDate.getDate() - barDate.getDay());
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    return {
      selectedDate: {
        start: startDate,
        end: endDate,
      },
      themeStyles: {
        wrapper: {
          border: '0',
          padding: '10px',
          background: 'linear-gradient(to bottom right, #ff5050, #ff66b3)',
          width: '300px',
          boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.14), 0 6px 20px 0 rgba(0, 0, 0, 0.13)',
          borderRadius: '5px',
        },
        header: {
          color: '#fafafa',
          padding: '10px 5px 20px 5px',
        },
        headerHorizontalDivider: {
          borderTop: 'solid rgba(255, 255, 255, 0.2) 1px',
          width: '80%',
        },
        weekdays: {
          color: '#6eded1',
          fontWeight: '600',
          padding: '20px 5px 5px 5px',
        },
        dayContent: {
          color: '#fafafa',
          fontSize: '0.9em',
        },
        dayContentHover: {
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
          cursor: 'pointer',
        },
        bars: {
          marginBottom: '1px',
          width: '60%',
        },
      },
      dragColor: '#E25478',
      selectColor: '#ca4d71',
      attributes: [
        {
          bar: {
            backgroundColor: '#fafafa',
          },
          dates: barDate,
        },
      ],
    };
  },
};
</script>
