---
title: 'Format & Parse Dates'
sidebarDepth: 2
---

# Format & Parse Dates

## Masks

Masks are used to properly format and parse different sections of the calendar and date picker components.

Masks are composed of tokens that derive from the active locale. Reference the [i18n](./i18n.html) section for more information about how masks can be explicitly provided with a locale or via the `masks` prop.

### Default Masks

Here are the default masks provided by the plugin.

| Mask | Target | Parse | Default |
| --- | --- | --- | --- |
| `title` | Calendar header title | | `"MMMM YYYY"` |
| `weekdays` | Weekday headers | | `"W"` |
| `navMonths` | Month labels in navigation dropdown | | `"MMM"` |
| `dayPopover` | Date in day popover when user hovers selected date. | | `"WWW, MMM D, YYYY"` |
| `input` | Date picker input for `mode: 'date'`. | ✔ | `["L", "YYYY-MM-DD", "YYYY/MM/DD"]` |
| `inputDateTime` | Date picker input for `mode: 'dateTime'` and `is24hr: false`. | ✔ | `["L h:mm A", "YYYY-MM-DD h:mm A", "YYYY/MM/DD h:mm A"]` |
| `inputDateTime24hr` | Date picker input for `mode: 'dateTime'` and `is24hr: true`. | ✔ | `["L HH:mm", "YYYY-MM-DD HH:mm", "YYYY/MM/DD HH:mm"]` |
| `inputTime` | Date picker input for `mode: 'time'` and `is24hr: false`. | ✔ | `["h:mm A"]` |
| `inputTime24hr` | Date picker input for `mode: 'time'` and `is24hr: true` .| ✔ | `["HH:mm"]` |
| `data` | Attribute `dates` property. | ✔ | `["L", "YYYY-MM-DD", "YYYY/MM/DD"]` |
| `iso` | Default iso format when used by `model-config` prop or other masks. | ✔ | `"YYYY-MM-DDTHH:mm:ss.SSSZ"` |

The parse flag indicates that a given mask is used to format **and parse** dates. [Read below for more details about parsing dates](#parsing-dates).

### Mask Tokens

Use the following tokens to configure your custom masks:

| | Token | Output |
| -------- | ----- | ------ |
| **Month** | `M` | 1, 2, ..., 12 |
| | `MM` | 01, 02, ..., 12 |
| | `MMM` | Jan, Feb, ..., Dec |
| | `MMMM` | January, February, ..., December |
| **Month Day** | `D` | 1, 2, ..., 31 |
| | `DD` | 01, 02, ..., 31 |
| | `Do` | 1st, 2nd, ..., 31st |
| **Week Day** | `d` | 1, 2, ..., 7 |
| | `d` | 1, 2, ..., 7 |
| | `dd` | 01, 02, ..., 07 |
| | `W` | S, M, ..., S |
| | `WW` | Su, Mo, ..., Sa |
| | `WWW` | Sun, Mon, ..., Sat |
| | `WWWW` | Sunday, Monday, ..., Saturday |
| **Year** | `YY` | 70, 71, ... 69 |
| | `YYYY` | 1970, 1971, ..., 2069 |
| **Hour** | `h` | 1, 2, ..., 11, 12 |
| | `hh` | 01, 01, ..., 11, 12 |
| | `H` | 0, 1, ..., 22, 23 |
| | `HH` | 00, 01, ..., 22, 23 |
| **Minute** | `m` | 1, 2, ..., 59, 60 |
| | `mm` | 01, 02, ..., 58, 59 |
| **Second** | `s` | 1, 2, ..., 58, 59 |
| | `ss` | 01, 02, ..., 58, 59 |
| **Fractional Second** | `S` | 0, 1, ..., 8, 9  |
| | `SS` | 0, 1, ..., 98, 99 |
| | `SSS` | 0, 1, ..., 998, 999 |
| **AM/PM** | `A` | AM PM |
| | `a` | am pm |
| **Timezone** | `ZZ` | -11, -10, ..., +10, +11 |
| | `ZZZ` | -1100, -1000, ..., +1000, +1100 |
| | `ZZZZ` | -11:00, -10:00, ..., +10:00, +11:00 |
| **Localized Date** | `L` | 01/21/1983 (en-US), 21/01/1983 (en-GB), ..., 1983/01/21 (*civilized*) |

## Parsing dates

You may notice that some default masks are assigned array values. This is because it uses the supplied mask(s) to parse, as well as display, the selected date.

The first supplied mask is used to format a given date, while all masks are used (from first to last) to parse the date string. The first successfully parsed date is used as the date value.

For example, consider the `input` mask which is used the format and parse dates for `v-date-picker` when an input element is supplied.

Since the default value for this mask is `["L", "YYYY-MM-DD", "YYYY/MM/DD"]`, any dates typed in these formats are valid. However, the first one (`"L"`) is ultimately used to display the date after the `change` event has been executed.

In the example below, type in a date in `YYYY-MM-DD` format to see this effect. If `YYYY-MM-DD` is your localized mask, type it in `YYYY/MM/DD`.

```html
<v-date-picker v-model="date">
  <template #default="{ inputValue, inputEvents }">
    <input class="px-3 py-1 border rounded" :value="inputValue" v-on="inputEvents" />
  </template>
</v-date-picker>
```

```js
export default {
  data() {
    return  {
      date: new Date(),
    }
  }
}
```

<guide-format-parse-dates-input />