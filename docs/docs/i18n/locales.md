---
title: 'Locales'
---

# Locales

A locale includes multiple settings that are typically assigned on a per region basis. This currently includes the following:

| Setting | Description |
| --- | --- |
| `firstDayOfWeek` | The day the specified the first day of the week. This is a number from 1 to 7 (Sunday to Saturday, respectfully). |
| `masks` | Set of masks to use for common sections of the calendar including the title, weekday labels, month labels in the navigation pane and more. |
| `dayNames` | Full length identifiers for the days of the week. |
| `dayNamesShort` | 3-character identifiers for the days of the week. |
| `dayNamesShorter` | 2-character identifiers for the days of the week. |
| `dayNamesNarrow` | 1-character identifiers for the days of the week. |
| `monthNames` | Full length identifiers for the months of the year. |
| `monthNamesShort` | Abbreviated identifiers for the months of the year. |

There are multiple ways which you can configure the locale for a specific calendar. Locales may be configured globally via the defaults object as well as on a per-calendar basis with the `locale` prop.

<BaseAlert>

The [well supported](https://caniuse.com/#feat=internationalization) Internationalization API is used to derive month and weekday names and formatting. This helps keep the package size down, as well as supporting multiple locales in the most performant and isomorphic way.
</BaseAlert>

## Default Locale

```html
<VCalendar />
```

With no locale specified, the locale detected by the Internationalization API is used.

## Default w/ Props

```html
<VCalendar :first-day-of-week="2" :masks="{ title: 'MMM YYYY' }" />
```

<Example centered>
  <VCalendar :first-day-of-week="2" :masks="{ title: 'MMM YYYY' }" />
</Example>

Uses the detected locale with customized `firstDayOfWeek` or `masks` that will override the built-in locale settings. When using a customized `masks` prop, the default masks will supply any masks that are missing, so you are free to provide single overrides.

## String Locale

```html
<VCalendar locale="es" />
```

<Example centered>
  <VCalendar locale="es" />
</Example>

With a string locale, the locale with the matching identifier is used. The Internationalization API is used to generate the `dayNames`, `dayNamesShort`, `dayNamesShorter`, `dayNamesNarrow`, `monthNames` and `monthNamesShort` properties. Because the API does not provide common values for the `firstDayOfWeek` or `masks` these are loaded from the plugin defaults (unless specifically provided via props).

## Object Locale

```html
<VCalendar :locale="{ id: 'da', firstDayOfWeek: 2, masks: { weekdays: 'WW' } }" />
```

<Example centered>
  <VCalendar :locale="{ id: 'da', firstDayOfWeek: 2, masks: { weekdays: 'WW' } }" />
</Example>

With an object locale, you can simply provide all the settings you need together in a single object.
Note that `firstDayOfWeek` and `masks` props will override this object.

## Custom Defaults

More conveniently, you may override or provide missing locale information via the `locales` property of the defaults object when using VCalendar. This should be an object with the locale identifier as the key and an object with the locale settings.

```js
import Vue from 'vue'
import VCalendar from 'v-calendar'

Vue.use(VCalendar, {
  locales: {
    'pt-PT': {
      firstDayOfWeek: 1,
      masks: {
        L: 'YYYY-MM-DD',
        // ...optional `title`, `weekdays`, `navMonths`, etc
      }
    }
  }
});
```

Then, all you need to do is reference your locale when using the calendar component.

```html
<VCalendar locale="pt-PT" />
```

<Example centered>
  <VCalendar locale="pt-PT" />
</Example>