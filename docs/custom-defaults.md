---
title: 'Custom Defaults'
sidebarDepth: 1
---

### Custom Defaults

Custom defaults can be provided on initialization. Note that almost all of these defaults can be overridden by props on `v-calendar` or `v-date-picker` components.

```js
Vue.use(VCalendar, {
  componentPrefix: 'vc', // Now use vc-calendar and vc-date-picker
  ...
})
```

[Click here to see all defaults.](../api/v2.0/defaults.md)