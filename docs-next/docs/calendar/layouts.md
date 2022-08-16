---
title: 'Layouts'
---

# Layouts

## Full Width

To expand the component to the full width of its container, set the `is-expanded` prop.

<Example>
  <Calendar is-expanded/>
</Example>

```html
<Calendar is-expanded />
```

## Title Positioning

To make the title header left or right aligned, use the `title-position` prop.

### Left Aligned

<Example centered>
  <Calendar title-position="left" />
</Example>

```html
<Calendar title-position="left" />
```

### Right Aligned

<Example centered>
  <Calendar title-position="right" />
</Example>

```html
<Calendar title-position="right" />
```

## Trim Weeks

By default, calendar panes always displays the maximum number of weeks in a month, even if the max week does not contain any days in the current month displayed.

This is to ensure user interface consistency and prevents the calendar height from always changing as the user navigates months.

However, these empty weeks can be 'trimmed' by setting the `trim-weeks` prop.

<Example centered>
  <Calendar trim-weeks />
</Example>

```html
<Calendar trim-weeks>
```

## Multiple Rows & Columns

Use the `rows` and `columns` props to create multi-row and multi-column static layouts.

<Example centered>
  <Calendar :rows="2"/>
</Example>

```html
<Calendar :rows="2" />
```

## Responsive Layouts

:::warning
Previous to 3.0, `v-calendar` provided a `$screens` function out-of-the-box to help create computed properties based on the current screen size. To minimize package size and complexity, this functionality has been extracted to an external package, [`vue-screen-utils`](https://github.com/nathanreyes/vue-screen-utils).
:::

To create dynamic `rows` or `columns` for , first install a utility tool like [`vue-screen-utils`](https://github.com/nathanreyes/vue-screen-utils) that can use media queries or `ResizeObserver` to create dynamic computed properties.

For this example, we can use the `mapCurrent` function to display 2 `columns` for large screens.

<Example centered>
  <LayoutsResponsive />
</Example>

```vue
<template>
  <Calendar :columns="columns" />
</template>
<script setup>
import { useScreens } from 'vue-screen-utils';

const { mapCurrent } = useScreens({ xs: '0px', sm: '640px', md: '768px', lg: '1024px' });
const columns = mapCurrent({ lg: 2 }, 1);
</script>
```

Next, for mobile layouts, we can expand the pane width to fill its container.

<Example centered>
  <LayoutsResponsiveExpanded />
</Example>

```vue
<template>
  <Calendar :columns="columns" :isExpanded="isExpanded" />
</template>
<script setup>
import { useScreens } from 'vue-screen-utils';

const { mapCurrent } = useScreens({
  xs: '0px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
});
const columns = mapCurrent({ lg: 2 }, 1);
const isExpanded = mapCurrent({ lg: false }, true);
</script>
```

Read more about [`vue-screen-utils`](https://github.com/nathanreyes/vue-screen-utils) for more options.