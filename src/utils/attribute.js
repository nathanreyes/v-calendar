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
    .map(d => (d.isDateInfo ? d : DateInfo(d, config.order)));
  const excludeDates =
    (
      (hasExcludeDates && config.excludeDates) ||
      []
    )
    .map(d => (d.isDateInfo ? d : DateInfo(d, config.order)));
  const isComplex = dates.some(d => d.isComplex);
  const attr = {
    isAttribute: true,
    key: config.key || 'guid',
    order: config.order || 0,
    dates,
    excludeDates,
    isComplex,
    // Any date partly intersects with given date
    intersectsDate: (date) => {
      const dateInfo = DateInfo(date);
      const matchDate = dates.find(d => d.intersectsDate(dateInfo));
      if (!matchDate || !hasExcludeDates) return matchDate;
      const matchExDate = excludeDates.find(ed => ed.includesDate(dateInfo));
      return matchExDate ? false : matchDate;
    },
    // Accepts: DayInfo object
    // Returns: First attribute date or date range that occurs on given day.
    includesDay: dayInfo => dates
      .map(d => d.includesDay(dayInfo))
      .find((d) => {
        // Date doesn't match
        if (!d) return null;
        // No exclude dates to check - just return first match
        if (!hasExcludeDates) return d;
        // Return date if it isn't part of the excluded dates
        return excludeDates.find(ed => ed.includesDay(dayInfo)) ? false : d;
      }),
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
  // Do some cleanup configuration for highlights
  if (attr.highlight && !attr.highlight.borderRadius) attr.highlight.borderRadius = attr.highlight.height;
  // Return the attribute
  return attr;
};

export default Attribute;
