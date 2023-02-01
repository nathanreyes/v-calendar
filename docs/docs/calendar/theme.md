# Theme

## Dark Mode

VCalendar supports a variety of dark mode strategies to ensure compatibility with your application. They are all configured by the `is-dark` prop.

### Manual Strategy

First, you can pass a boolean value for `isDark` to set the dark mode manually.

<BaseAlert info>

By default, `is-dark` is `false`, so if left unassigned, the calendar will always display in light mode.
</BaseAlert>

<ThemeDarkModeManual />

```vue
<template>
<div class="space-y-2">
  <div class="flex items-center space-x-2">
    <input id="darkmode" type="checkbox" v-model="isDark" />
    <label for="darkmode"> Dark Mode </label>
  </div>
  <VCalendar :is-dark="isDark" />
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
  <VCalendar is-dark="system" />
</template>
```

### Class Strategy

Finally, dark mode can be activated if a class is present on an element.

For example, most calendars on this site sync with this site's dark mode by watching for the `dark` class on the `:root` element.

To use the class strategy, pass an object with the element `selector` and `darkClass` to check against. Any class updates made on the element are watched with a `MutationObserver` to detect future changes made by the user.

<Example centered>
  <VCalendar :is-dark="{ selector: ':root', darkClass: 'dark' }" />
</Example>

```html
<template>
  <VCalendar is-dark="{ selector: ':root', darkClass: 'dark' }" />
<template>
```

Because `:root` and `dark` are the default `selector` and `darkClass`, respectively, a simple object could be passed to achieve the same effect.

<Example centered>
  <VCalendar :is-dark="{}" />
</Example>

```html
<template>
  <VCalendar is-dark="{}" />
<template>
```

## Colors

VCalendar ships with support for 10 colors: **gray**, **red**, **orange**, **yellow**, **green**, **teal**, **blue**, **indigo**, **purple**, **pink**.

You can apply a theme color with the `color` prop.

<ThemeColors />

```vue
<template>
  <VCalendar
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

## Custom Theme

Colors and other styles for both light and dark modes may be customized by overriding css variables defined within your own custom theme stylesheet.

Use the [default stylesheet](https://github.com/nathanreyes/v-calendar/blob/v3/src/styles/theme.css) as a guide.

### Adding a custom color

Custom colors may be added by creating a color class prefixed with `vc-` in your stylesheet or SFC `style` block. For example, to add a sky blue color, create a `vc-sky-blue` class that overrides the accent color scale.

```css
/* Sky blue */
.vc-sky-blue {
  --vc-accent-50: #f0f9ff;
  --vc-accent-100: #e0f2fe;
  --vc-accent-200: #bae6fd;
  --vc-accent-300: #7dd3fc;
  --vc-accent-400: #38bdf8;
  --vc-accent-500: #0ea5e9;
  --vc-accent-600: #0284c7;
  --vc-accent-700: #0369a1;
  --vc-accent-800: #075985;
  --vc-accent-900: #0c4a6e;
}
```

Once the color is defined, it may be used anywhere colors are referenced, including the `Calendar.color` prop or as an [attribute](./attributes#colors) color.

<ThemeCustomColors />

```vue
<script setup>
import { ref } from 'vue';

const attrs = ref([
  {
    highlight: true,
    dates: new Date(),
  },
]);
</script>
<template>
  <VCalendar color="sky-blue" :attributes="attrs" />
</template>
```

### Replace an existing color

We can also use the same approach to update an existing color. For example, we may want to override the built-in blue color with sky blue.

```css
/* Replace blue with sky blue palette */
.vc-blue {
  --vc-accent-50: #f0f9ff;
  --vc-accent-100: #e0f2fe;
  --vc-accent-200: #bae6fd;
  --vc-accent-300: #7dd3fc;
  --vc-accent-400: #38bdf8;
  --vc-accent-500: #0ea5e9;
  --vc-accent-600: #0284c7;
  --vc-accent-700: #0369a1;
  --vc-accent-800: #075985;
  --vc-accent-900: #0c4a6e;
}
```
