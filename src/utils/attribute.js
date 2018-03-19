import DateInfo from './dateInfo';
// import defaults from './defaults';
import { arrayHasItems } from './helpers';
import { isArray } from './typeCheckers';

const Attribute = config => {
  if (!config) return null;
  if (config.isAttribute) return config;
  if (config.dates && !isArray(config.dates)) config.dates = [config.dates];
  if (config.excludeDates && !isArray(config.excludeDates))
    config.excludeDates = [config.excludeDates];
  const hasDates = arrayHasItems(config.dates);
  const hasExcludeDates = arrayHasItems(config.excludeDates);
  const excludeMode = config.excludeMode || 'intersects';
  const dates = (
    (hasDates && config.dates) || // Use provided dates if they have items
    (hasExcludeDates && [{}]) || // Use infinite range if exclude dates were provided
    []
  ) // Use just an empty array
    .map(d => d && (d.isDateInfo ? d : DateInfo(d, config.order)))
    .filter(d => d);
  const excludeDates = ((hasExcludeDates && config.excludeDates) || [])
    .map(d => d && (d.isDateInfo ? d : DateInfo(d, config.order)))
    .filter(d => d);
  const isComplex = dates.some(d => d.isComplex);
  const attr = {
    ...config,
    isAttribute: true,
    key: config.key || 'guid',
    order: config.order || 0,
    dates,
    excludeDates,
    isComplex,
    // Accepts: Date or date range object
    // Returns: First attribute date info that partially intersects the given date
    intersectsDate: date =>
      !attr.excludesDate(date) &&
      (dates.find(d => d.intersectsDate(date)) || false),
    // Accepts: Date or date range object
    // Returns: First attribute date info that completely includes the given date
    includesDate: date =>
      !attr.excludesDate(date) &&
      (dates.find(d => d.includesDate(date)) || false),
    excludesDate: date =>
      hasExcludeDates &&
      excludeDates.find(
        ed =>
          (excludeMode === 'intersects' && ed.intersectsDate(date)) ||
          (excludeMode === 'includes' && ed.includesDate(date)),
      ),
    // Accepts: Day object
    // Returns: First attribute date info that occurs on given day.
    includesDay: day =>
      !attr.excludesDay(day) && (dates.find(d => d.includesDay(day)) || false),
    excludesDay: day =>
      hasExcludeDates && excludeDates.find(ed => ed.includesDay(day)),
  };
  // Return the attribute
  return attr;
};

export default Attribute;
