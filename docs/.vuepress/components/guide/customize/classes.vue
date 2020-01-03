<template>
  <div class="center">
    <v-calendar :attributes="attributes" :from-date="new Date(2018, 0, 1)" :masks="masks"></v-calendar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      attributes: [
        {
          highlight: {
            backgroundColor: '#3b3cab',
            height: '2.4rem',
          },
          contentStyle: {
            color: '#fafafa',
          },
          dates: {
            start: new Date(2018, 0, 7),
            end: new Date(2018, 0, 13),
          },
        },
        {
          highlight: {
            backgroundColor: '#f94f83',
            height: '2.4rem',
          },
          contentStyle: {
            color: '#fafafa',
          },
          dates: new Date(2018, 0, 12),
        },
      ],
      masks: {
        title: 'MMM YYYY',
        weekdays: 'WW',
      },
    };
  },
};
</script>

<style scoped>
/* /deep/ .c-pane-container {
  background: linear-gradient(to bottom right, #25266c, #343698);
  border-radius: 10px;
  padding: 0 8px;
  .c-day {
    min-height: 2.4rem;
    &:not(.in-month) > * {
      opacity: 0;
    }
  }
  .c-header {
    color: #dadada;
    padding: 20px 15px 10px 15px;
  }
  .c-title {
    font-size: 1rem;
    font-weight: 500;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    &:first-letter {
      font-size: 1.2rem;
    }
  }
  .c-arrow {
    color: #7d799b;
    margin-top: 10px;
  }
  .c-weeks {
    padding: 0;
  }
  .c-weekdays {
    color: #2ecdba;
    font-size: 0.8rem;
    font-weight: 700;
    padding: 10px 0;
  }
  .c-day-content {
    color: #3b5b93;
    font-size: 0.9rem;
    font-weight: 500;
    margin: 8px;
  }
} */
</style>