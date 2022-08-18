# Theme

## Dark Mode

V-Calendar supports a variety of dark mode strategies to ensure compatibility with your application. They are all configured by the `is-dark` prop.

### Manual Strategy

First, you can pass a boolean value for `isDark` to set the dark mode manually.

:::info
By default, `is-dark` is `false`, so if left unassigned, the calendar will always display in light mode.
:::

<ThemeDarkModeManual />

```vue
<template>
<div class="space-y-2">
  <div class="flex items-center space-x-2">
    <input id="darkmode" type="checkbox" v-model="isDark" />
    <label for="darkmode"> Dark Mode </label>
  </div>
  <Calendar :is-dark="isDark" />
</div>
</template>
<script setup>
import { ref } from 'vue';
const isDark = ref(false);
</script>
```

### System Preference Strategy

When assigning `is-dark: "system"`, it will use the `Window.matchMedia()` API to apply the user's system preference. This setting is continually watched to detect future changes made by the user.

For example, to view the effect on the Mac, you can navigate to  **System Preferences	&#8250; General** and switch the **Appearance** setting between `Light`, `Dark` and `Auto`.

<ThemeDarkModeSys />

```vue
<template>
  <Calendar is-dark="system" />
</template>
```

### Class Strategy

Finally, VCalendar can be configured to apply dark mode if a class is present on an element. Any class updates made on the element are watched with a `MutationObserver` to detect future changes made by the user.

To use the class strategy, pass an object with the element `selector` and `darkClass` to check against.

For example, most calendars present on this site sync with this site's dark mode by watching for the `dark` class on the `:root` element.

<Example centered>
  <Calendar :is-dark="{ selector: ':root', darkClass: 'dark' }" />
</Example>

```html
<template>
  <Calendar is-dark="{ selector: ':root', darkClass: 'dark' }" />
<template>
```

Because `:root` and `dark` are the default `selector` and `darkClass`, respectively, a simple object could be passed to achieve the same effect.

<Example centered>
  <Calendar :is-dark="{}" />
</Example>

```html
<template>
  <Calendar is-dark="{}" />
<template>
```

## Colors

VCalendar ships with support for 10 colors: **gray**, **red**, **orange**, **yellow**, **green**, **teal**, **blue**, **indigo**, **purple**, **pink**.

You can apply a theme color with the `color` prop.

<ThemeColors />

```vue
<template>
  <Calendar
    :initial-page="{ month: 4, year: 2019 }"
    :color="selectedColor.value"
    :attributes="attrs"
  />
</template>
<script setup>
import { ref } from 'vue';

const selectedColor = ref('blue');
const attrs = ref([
  {
    key: 'test',
    highlight: true,
    dates: { start: new Date(2019, 3, 15), end: new Date(2019, 3, 19) },
  }
]);
</script>
```

## Custom Colors
