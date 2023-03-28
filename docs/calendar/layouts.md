---
title: 'Layouts'
---

# Layouts

## Full Width

To expand the component to the full width of its container, set the `expanded` prop.

<Example>
  <VCalendar expanded/>
</Example>

```html
<VCalendar expanded />
```

## Title Positioning

To make the title header left or right aligned, use the `title-position` prop.

### Left Aligned

<Example centered>
  <VCalendar title-position="left" />
</Example>

```html
<VCalendar title-position="left" />
```

### Right Aligned

<Example centered>
  <VCalendar title-position="right" />
</Example>

```html
<VCalendar title-position="right" />
```

## Weekly View

Set the `view` prop to display the calendar in 'weekly' view.

<Example centered>
  <VCalendar view="weekly" />
</Example>

```html
<VCalendar view="weekly" />
```

## Weeknumbers

### Left

Show week numbers by setting the `show-weeknumbers` prop.

<Example centered>
  <VCalendar show-weeknumbers />
</Example>

```html
<VCalendar show-weeknumbers />
```

By default, this will display the numbers on the left side within the calendar pane.

The `show-weeknumbers` can also be assigned to left and outside positions.

### Left Outside

<Example centered>
  <VCalendar show-weeknumbers="left-outside" />
</Example>

```html
<VCalendar show-weeknumbers="left-outside" />
```

### Right

<Example centered>
  <VCalendar show-weeknumbers="right" />
</Example>

```html
<VCalendar show-weeknumbers="right" />
```

### Right Outside

<Example centered>
  <VCalendar show-weeknumbers="right-outside" />
</Example>

```html
<VCalendar show-weeknumbers="right-outside" />
```

### ISO Weeknumbers

To show ISO week numbers, use the `show-iso-weeknumbers` prop with the same convention as `show-weeknumbers`. If both are assigned, the `show-weeknumbers` prop takes precendence.

Since ISO weeks start on Monday, it makes sense to also set Monday as the first day of the week when setting `show-iso-weeknumbers`.

<Example centered>
  <VCalendar :first-day-of-week="2" show-iso-weeknumbers />
</Example>

```html
<VCalendar :first-day-of-week="2" show-iso-weeknumbers />
```

<BaseAlert warning>

For the ISO week date standard (ISO-8601), weeks start on Monday and end on Sunday. If the `firstDayOfWeek` setting is different (U.S. default), this could result in 2 weeks displaying the same week number for certain months.
</BaseAlert>

## Trim Weeks

By default, calendar panes always displays the maximum number of weeks in a month, even if the max week does not contain any days in the current month displayed.

This is to ensure user interface consistency and prevents the calendar height from always changing as the user navigates months.

However, these empty weeks can be 'trimmed' by setting the `trim-weeks` prop.

<Example centered>
  <VCalendar trim-weeks />
</Example>

```html
<VCalendar trim-weeks>
```

## Footer

<Example centered>
  <LayoutsFooter />
</Example>

```vue
<template>
  <VCalendar ref="calendar">
    <template #footer>
      <div class="w-full px-4 pb-3">
        <button
          class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold w-full px-3 py-1 rounded-md"
          @click="moveToday"
        >
          Today
        </button>
      </div>
    </template>
  </VCalendar>
</template>

<script setup>
import { ref } from 'vue';

const calendar = ref(null);

function moveToday() {
  calendar.value.move(new Date());
}
</script>
```

## Multiple Rows & Columns

Use the `rows` and `columns` props to create multi-row and multi-column static layouts.

<Example centered>
  <VCalendar :rows="2"/>
</Example>

```html
<VCalendar :rows="2" />
```

## Responsive Layouts

Previous to 3.0, `v-calendar` provided a `$screens` function out-of-the-box to help create computed properties based on the current screen size. To minimize package size and complexity, this built-in functionality has been removed.

To reproduce this behavior, you can bind to computed `rows` or `columns` using your own logic, or install a 3rd-party plugin like [`vue-screen-utils`](https://github.com/nathanreyes/vue-screen-utils) that can create dynamic computed properties based on media queries or `ResizeObserver`.

For this example, we can use the `mapCurrent` function exported by [`vue-screen-utils`](https://github.com/nathanreyes/vue-screen-utils) to display 2 `columns` for large screens.

<Example centered>
  <LayoutsResponsive />
</Example>

```vue
<template>
  <VCalendar :columns="columns" />
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
  <VCalendar :columns="columns" :expanded="expanded" />
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
const expanded = mapCurrent({ lg: false }, true);
</script>
```

Read more about [`vue-screen-utils`](https://github.com/nathanreyes/vue-screen-utils) for more options.