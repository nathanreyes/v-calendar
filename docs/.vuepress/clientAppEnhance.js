import VCalendar from '../../src/index.ts';
import './theme/styles/tailwind.css';

export default ({ app }) => {
  app.use(VCalendar, {
    locales: {
      'pt-PT': {
        firstDayOfWeek: 1,
        masks: {
          L: 'YYYY-MM-DD', // Default for formatting/parsing dates
        },
      },
      // Added for GitHub Issue #330
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
