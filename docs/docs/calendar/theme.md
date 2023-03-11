# Theme

VCalendar supports some basic helper props to avoid having to manually [override styles](#custom-styles).

## Borderless

Set the `borderless` prop to simple reset the border width and radius.

<Example centered>
  <VCalendar borderless />
</Example>

```vue
<template>
  <VCalendar borderless />
</template>
```

## Transparent

Set the `transparent` prop to reset the background color. This prop should be used if embedding the calendar within another container. Most often, this prop should be set in combination with the `borderless` prop.

<Example centered>
  <VCalendar transparent borderless />
</Example>

```vue
<template>
  <VCalendar transparent borderless />
</template>
```

## Colors

VCalendar ships with support for 10 colors: **gray**, **red**, **orange**, **yellow**, **green**, **teal**, **blue**, **indigo**, **purple**, **pink**.

You can apply a theme color with the `color` prop.

<Example centered>
  <ThemeColors />
</Example>

```vue
<template>
  <VCalendar
    :initial-page="{ month: 4, year: 2019 }"
    :color="selectedColor"
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

Colors may be added or customized using [CSS variables](#css-variables)

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

## Custom styles

Manually overriding styles in css is possible when more customization is required. There are 2 methods we can use to accomplish this.

<BaseAlert title="Style warning" warning>
  While class names and element structure are relatively stable, it should be noted that they could change across minor and patch versions.
</BaseAlert>

### Global styles

First we can simply apply a global style that will affect all calendars. It is recommended to nest target classes within `.vc-container` to meet the specificity required to override any default styles.

<Example centered>
  <ThemeStyles />
</Example>

```vue
<template>
  <VCalendar />
</template>

<style>
.vc-container .vc-weekday-1, .vc-container .vc-weekday-7 {
  color: #6366f1;
}
</style>
```

#### Custom wrapper class

We can also apply a custom class to the component itself to target specific instances of our calendar.

<Example centered>
  <ThemeStyles />
</Example>

```vue
<template>
  <VCalendar class="my-calendar" />
</template>

<style>
.my-calendar .vc-weekday-1, .my-calendar .vc-weekday-7 {
  color: #6366f1;
}
</style>
```

### Scoped styles

If applying custom styles within a scoped component, then the `:deep()` pseudo-class is required combined with a custom wrapper element.

<Example centered>
  <ThemeStyles />
</Example>

```vue
<template>
  <div class="my-calendar">
    <VCalendar />
  </div>
</template>

<style scoped>
.my-calendar :deep(.vc-weekday-1, .vc-weekday-7) {
  color: #6366f1;
}
</style>
```

## CSS Variables

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