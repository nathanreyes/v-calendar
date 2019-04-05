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
    },
  });
};
