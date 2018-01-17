import DateInfo from './dateInfo';
import defaults from './defaults';
import { mixinOptionalProps, arrayHasItems } from './helpers';
import { isArray } from './typeCheckers';

const Attribute = (config) => {
  if (!config) return null;
  if (config.isAttribute) return config;
  if (config.dates && !isArray(config.dates)) config.dates = [config.dates];
  if (config.excludeDates && !isArray(config.excludeDates)) config.excludeDates = [config.excludeDates];
  const hasDates = arrayHasItems(config.dates);
  const hasExcludeDates = arrayHasItems(config.excludeDates);
  const dates =
    (
      (hasDates && config.dates) || // Use provided dates if they have items
      (hasExcludeDates && [{}]) ||  // Use infinite range if exclude dates were provided
      []                            // Use just an empty array
    )
    .map(d => d && (d.isDateInfo ? d : DateInfo(d, config.order)))
    .filter(d => d);
  const excludeDates =
    (
      (hasExcludeDates && config.excludeDates) ||
      []
    )
    .map(d => d && (d.isDateInfo ? d : DateInfo(d, config.order)))
    .filter(d => d);
  const isComplex = dates.some(d => d.isComplex);
  const attr = {
    isAttribute: true,
    key: config.key || 'guid',
    order: config.order || 0,
    dates,
    excludeDates,
    isComplex,
    // Any date partly intersects with given date
    intersectsDate: date => dates.find((d) => {
      // Date doesn't match
      if (!d.intersectsDate(date)) return null;
      // No exclude dates to check - just return first match
      if (!hasExcludeDates) return d;
      // Return match date if test date doesn't intersect any excluded dates
      return excludeDates.find(ed => ed.intersectsDate(date)) ? false : d;
    }) || false,
    // Accepts: Date or date range object
    // Returns: First attribute date info that occurs on given date
    includesDate: date => dates.find((d) => {
      // Date doesn't match
      if (!d.includesDate(date)) return null;
      // No exclude dates to check - just return first match
      if (!hasExcludeDates) return d;
      // Return match date if test date doesn't intersect any excluded dates
      return excludeDates.find(ed => ed.intersectsDate(date)) ? false : d;
    }) || false,
    // Accepts: DayInfo object
    // Returns: First attribute date info that occurs on given day.
    includesDay: dayInfo => dates.find((d) => {
      // Date doesn't match
      if (!d.includesDay(dayInfo)) return null;
      // No exclude dates to check - just return first match
      if (!hasExcludeDates) return d;
      // Return match date if test day doesn't intersect any excluded dates
      return excludeDates.find(ed => ed.includesDay(dayInfo)) ? false : d;
    }) || false,
  };
  mixinOptionalProps(config, attr, [
    { name: 'highlight', mixin: defaults.highlight },
    { name: 'highlightCaps', mixin: defaults.highlightCaps },
    { name: 'dot', mixin: defaults.dot },
    { name: 'dotCaps' },
    { name: 'bar', mixin: defaults.bar },
    { name: 'barCaps' },
    { name: 'contentStyle' },
    { name: 'contentStyleCaps' },
    { name: 'contentHoverStyle' },
    { name: 'popover' },
    { name: 'customData' },
  ]);
  // Return the attribute
  return attr;
};

export default Attribute;
