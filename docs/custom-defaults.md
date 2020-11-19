---
title: 'Custom Defaults'
sidebarDepth: 1
---

### Custom Defaults

Custom defaults can be provided with the `setupCalendar` method, make sure to call it before using any
components. Almost all of the defaults can be also be overridden by props on `v-calendar` or `v-date-picker` components.

```js
import { setupCalendar } from 'v-calendar'

// main.js
setupCalendar({
  componentPrefix: 'vc',
  ...,
});
```

[Click here to see all defaults.](../api/v2.0/defaults.md)
