import defaults from './defaults';

const DayStore = (config) => {
  // Map of page numbers to weeks
  const pageWeeks = {};
  const firstDayOfWeek = config.firstDayOfWeek || defaults.firstDayOfWeek;
  return {
    getWeeks(page) {

    },
  };
};

export default DayStore;

// if (!year || !month) return undefined;
// let yearData = this.map[year];
// if (!yearData) {
//   yearData = {};
//   this.map[year] = yearData;
// }
// let monthData = yearData[month];
// if (!monthData) {
//   const comps = getMonthComps(month, year);
//   const range = new DateInfo({
//     start: new Date(comps.year, comps.month - 1, 1),
//     end: new Date(comps.year, comps.month, comps.days),
//   });
//   const list = list.filter(a => a.dates.find(d => d.intersects(range)));
//   monthData = {
//     range,
//     list,
//   };
//   for (let d = 1; d <= comps.days; d++) {
//     const date = new Date(year, month - 1, d);
//     monthData[d] = list
//       .map((a) => {
//         const na = {
//           ...a,
//           dateInfo: a.dates.find(ad => ad.containsDate(date)),
//         };
//         delete na.dates;
//         return na;
//       })
//       .filter(a => a.dateInfo)
//       .sort((a, b) => a.dateInfo.compare(b.dateInfo));
//   }
//   yearData[month] = monthData;
// }
// if (day) return monthData[day];
// return monthData.list;
