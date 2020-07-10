import DateInfo from './dateInfo';
import { arrayHasItems, createGuid } from './helpers';
import { isUndefined, isArray, some } from './_';

export default class Attribute {
  constructor(
    {
      key,
      hashcode,
      highlight,
      content,
      dot,
      bar,
      popover,
      dates,
      excludeDates,
      excludeMode,
      customData,
      order,
      pinPage,
    },
    theme,
    locale,
  ) {
    this.key = isUndefined(key) ? createGuid() : key;
    this.hashcode = hashcode;
    this.customData = customData;
    this.order = order || 0;
    this.dateOpts = { order, locale };
    this.pinPage = pinPage;
    // Normalize attribute types
    if (highlight) {
      this.highlight = theme.normalizeHighlight(highlight);
    }
    if (content) {
      this.content = theme.normalizeContent(content);
    }
    if (dot) {
      this.dot = theme.normalizeDot(dot);
    }
    if (bar) {
      this.bar = theme.normalizeBar(bar);
    }
    if (popover) {
      this.popover = popover;
    }
    // Wrap dates in array if needed
    if (dates) {
      this.dates = isArray(dates) ? dates : [dates];
    }
    this.hasDates = arrayHasItems(this.dates);
    // Wrap exclude dates in array if needed
    if (excludeDates) {
      this.excludeDates = isArray(excludeDates) ? excludeDates : [excludeDates];
    }
    this.hasExcludeDates = arrayHasItems(this.excludeDates);
    this.excludeMode = excludeMode || 'intersects';
    // Assign final dates
    this.dates = (
      (this.hasDates && this.dates) ||
      (this.hasExcludeDates && [{}]) ||
      []
    )
      .map(
        d => d && (d instanceof DateInfo ? d : new DateInfo(d, this.dateOpts)),
      )
      .filter(d => d);
    // Assign final exclude dates
    this.excludeDates = ((this.hasExcludeDates && this.excludeDates) || [])
      .map(
        d => d && (d instanceof DateInfo ? d : new DateInfo(d, this.dateOpts)),
      )
      .filter(d => d);
    this.isComplex = some(this.dates, d => d.isComplex);
  }

  // Accepts: Date or date range object
  // Returns: First date that partially intersects the given date
  intersectsDate(date) {
    return (
      !this.excludesDate(date) &&
      (this.dates.find(d => d.intersectsDate(date)) || false)
    );
  }

  // Accepts: Date or date range object
  // Returns: First date that completely includes the given date
  includesDate(date) {
    date = date instanceof DateInfo ? date : new DateInfo(date, this.dateOpts);
    return (
      !this.excludesDate(date) &&
      (this.dates.find(d => d.includesDate(date)) || false)
    );
  }

  excludesDate(date) {
    date = date instanceof DateInfo ? date : new DateInfo(date, this.dateOpts);
    return (
      this.hasExcludeDates &&
      this.excludeDates.find(
        ed =>
          (this.excludeMode === 'intersects' && ed.intersectsDate(date)) ||
          (this.excludeMode === 'includes' && ed.includesDate(date)),
      )
    );
  }

  // Accepts: Day object
  // Returns: First attribute date info that occurs on given day.
  intersectsDay(day) {
    return (
      !this.excludesDay(day) &&
      (this.dates.find(d => d.intersectsDay(day)) || false)
    );
  }

  excludesDay(day) {
    return (
      this.hasExcludeDates &&
      this.excludeDates.find(ed => ed.intersectsDay(day))
    );
  }
}
