const disabledTests = [
  // Min date
  {
    it: ':min-date disables days, arrows and nav state',
    props: { fromPage: { month: 11, year: 2020 }, minDate: new Date(2020, 10, 15) },
    disabledDays: [{ start: 1, end: 14 }],
    disabledArrows: ['left'],
    nav: {
      months: {
        disabledArrows: ['left'],
        disabledMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        year: 2020,
      },
      years: {
        disabledArrows: ['left'],
        disabledYears: [2016, 2017, 2018, 2019],
      },
    },
  },
  // Max date
  {
    it: ':max-date disables days, arrows and nav state',
    props: { fromPage: { month: 11, year: 2020 }, maxDate: new Date(2020, 10, 15) },
    disabledDays: [{ start: 16, end: 30 }],
    disabledArrows: ['right'],
    nav: {
      months: {
        disabledArrows: ['right'],
        disabledMonths: [12],
        year: 2020,
      },
      years: {
        disabledArrows: ['right'],
        disabledYears: [2021, 2022, 2023, 2024, 2025, 2026, 2027],
      },
    },
  },
  // Min date and max date
  {
    it: ':min-date and :max-date disable days, arrows and nav state',
    props: {
      fromPage: { month: 11, year: 2020 },
      minDate: new Date(2020, 10, 10),
      maxDate: new Date(2020, 10, 20),
    },
    disabledDays: [
      { start: 1, end: 9 },
      { start: 21, end: 30 },
    ],
    disabledArrows: ['left', 'right'],
    nav: {
      months: {
        disabledArrows: ['left', 'right'],
        disabledMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12],
        year: 2020,
      },
      years: {
        disabledArrows: ['left', 'right'],
        disabledYears: [2016, 2017, 2018, 2019, 2021, 2022, 2023, 2024, 2025, 2026, 2027],
      },
    },
  },
  // Daily interval
  {
    it: ':disabled-dates disables daily interval',
    props: {
      fromPage: { month: 11, year: 2020 },
      disabledDates: [{ start: new Date(2020, 10, 1), end: null, on: { dailyInterval: 4 } }],
    },
    disabledDays: [1, 5, 9, 13, 17, 21, 25, 29],
  },
  // Daily interval with min and max date
  {
    it:
      ':min-date, :max-date, :disabled-dates disables days, arrows and nav state for daily interval',
    props: {
      fromPage: { month: 11, year: 2020 },
      disabledDates: [{ start: new Date(2020, 10, 1), end: null, on: { dailyInterval: 4 } }],
      minDate: new Date(2020, 10, 10),
      maxDate: new Date(2020, 10, 20),
    },
    disabledDays: [1, 5, 9, 13, 17, 21, 25, 29, { start: 1, end: 9 }, { start: 21, end: 30 }],
    disabledArrows: ['left', 'right'],
    nav: {
      months: {
        disabledArrows: ['left', 'right'],
        disabledMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12],
        year: 2020,
      },
      years: {
        disabledArrows: ['left', 'right'],
        disabledYears: [2016, 2017, 2018, 2019, 2021, 2022, 2023, 2024, 2025, 2026, 2027],
      },
    },
  },
];

module.exports = disabledTests;
