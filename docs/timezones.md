---
title: 'Timezones (Beta) :tada:'
sidebarDepth: 2
---

# Timezones (Beta)

:::warning
While multiple tests have been written for timezone support, it still may be supported differently across different browsers.
:::

Timezones are supported for both `v-date-picker` and `v-calendar` via the [Internationalization API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl). To assign a timezone, pass the `timezone: String` prop with the desired timezone setting. Reference this [stack overflow](https://stackoverflow.com/questions/38399465/how-to-get-list-of-all-timezones-in-javascript) question for a base list of available timezones.

By default, the `timezone` prop is `undefined`, which defaults to using the browser's local timezone.

## UTC

In addition to the timezones supported, `UTC` may be used for the Coordinated Universal Time setting.

## Calendar Attributes

In `v-calendar`, the timezone is used to set the beginning and ending time boundaries for each calendar day. As a result, a calendar attribute that displays for a user in one timezone may display differently in another timezone.

<guide-timezones-range />