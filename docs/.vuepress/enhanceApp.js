import VCalendar from '../../src/lib';
import './styles/tailwind.css';

export default ({ Vue }) => {
  Vue.use(VCalendar, {
    locales: {
      'pt-PT': {
        firstDayOfWeek: 1,
        masks: {
          L: 'YYYY-MM-DD', // Default for formatting/parsing dates
        },
      },
      // Added for Github Issue #330
      hu: {
        firstDayOfWeek: 2,
        masks: {
          L: 'YYYY.MM.DD',
          title: 'YYYY MMMM', // <- this doesn't work
        },
      },
    },
  });
};
