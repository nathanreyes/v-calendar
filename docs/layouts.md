---
title: 'Layouts'
sidebarDepth: 2
---

<!-- ## Layouts -->

## Full Width

To expand the component to the full width of its container, set the `is-expanded` prop.

<guide-layouts-expanded />

```html
<v-calendar is-expanded />
```

## Title Positioning

To make the title header left or right aligned, use the `title-position` prop.

### Left Aligned

<guide-layouts-title-position title-position="left" />

```html
<v-calendar title-position="left" />
```

### Right Aligned

<guide-layouts-title-position title-position="right" />

```html
<v-calendar title-position="right" />
```

## Trim Weeks

By default, calendar panes always displays the maximum number of weeks in a month, even if the max week does not contain any days in the current month displayed.

This is to ensure user interface consistency and prevents the calendar height from always changing as the user navigates months.

However, these empty weeks can be 'trimmed' by setting the `trim-weeks` prop.

<guide-layouts-trim-weeks />

```html
<v-calendar trim-weeks>
```

## Week Numbers :tada:

Show week numbers in the calendar using the `show-weeknumbers` prop.

<guide-layouts-weeknumbers />

```html
<v-calendar show-weeknumbers />
```

By default, this will display the numbers inside the calendar pane.

Alternatively, you can display the week numbers outside the calendar or on the right side by providing a value for the prop.

#### Left Outside

<guide-layouts-weeknumbers option="left-outside" />

```html
<v-calendar show-weeknumbers="left-outside">
```

#### Right

<guide-layouts-weeknumbers option="right" />

```html
<v-calendar show-weeknumbers="right">
```

#### Right Outside

<guide-layouts-weeknumbers option="right-outside" />

```html
<v-calendar show-weeknumbers="right-outside">
```

### ISO Week Numbers

To display ISO week numbers, use the `show-iso-weeknumbers` prop with the same convention as `show-weeknumbers`. If both are assigned, the `show-weeknumbers` prop takes precendence.

<guide-layouts-weeknumbers iso />

```html
<v-calendar :first-day-of-week="2" show-iso-weeknumbers />
```

:::warning
For the ISO week date standard (ISO-8601), weeks start on **Monday** and end on **Sunday**. If the `firstDayOfWeek` setting is different (US), this could result in 2 weeks displaying the same week number in certain months.
:::

## Multiple Rows & Columns

Use the `rows` and `columns` props to create multi-row and multi-column static layouts.

<guide-layouts-rows />

```html
<v-calendar :rows="2" />
```

## Responsive Layouts

V-Calendar allows you build responsive designs for multiple screen sizes.

The basic approach can be described in two steps:

1. Specify a few screen sizes to monitor by providing a set of breakpoints (`sm`, `md`, `lg` and `xl`). [The screen size names and dimensions are configurable](#screen-sizes).

2. Call the `$screens` function to assign props or create computed properties based on the current screen size. This function automatically re-evaluates behind the scenes any time the window crosses a breakpoint border.

V-Calendar takes a mobile-first approach, where each screen represents a minimum viewport width. Any values you assign at smaller screen sizes are also applied to larger sizes, unless explicity overridden.

For example, suppose we wish to display a single column on mobile. Then, at the large size, we wish to expand the calendar to two columns.

<guide-layouts-responsive />

```html
<v-calendar :columns="$screens({ default: 1, lg: 2 })" />
```

When calling the `$screens` function to target multiple screens, pass an object to specify the screen-to-value relationships with target screen sizes as the key. Use the `default` key to target the default mobile layout.

Alternatively, we can pass the default value as a second parameter to the `$screens` function.

```html
<!--Same as before, just passing default value as second parameter-->
<v-calendar :columns="$screens({ lg: 2 }, 1)" />
```

Let's add to the previous example so that a new row is added for large screens. Also, we would also like to expand the pane width to fill its container on mobile when only one column and row is displayed.

<guide-layouts-responsive-expanded />

```html
<v-calendar
  :columns="$screens({ default: 1, lg: 2 })"
  :rows="$screens({ default: 1, lg: 2 })"
  :is-expanded="$screens({ default: true, lg: false })"
  />
```

We could rework the previous example to make it a bit more intuitive by creating a comprehensive `layout` computed property that just calls the `$screens` function once.

```html
<v-calendar
  :columns="layout.columns"
  :rows="layout.rows"
  :is-expanded="layout.isExpanded"
  />
```

```js
export default {
  computed: {
    layout() {
      return this.$screens(
        {
          // Default layout for mobile
          default: {
            columns: 1,
            rows: 1,
            isExpanded: true,
          },
          // Override for large screens
          lg: {
            columns: 2,
            rows: 2,
            isExpanded: false,
          },
        },
      );
    }
  }
}
```

:::tip
The `$screens` function is included as a lightweight mixin for all components. It can be used to make any of your props or computed properties responsive in any of your own components.
:::

### Screen Sizes

There are 4 screen sizes provided by default:
```js
{
  "sm": "640px",  // (min-width: 640px)
  "md": "768px",  // (min-width: 768px)
  "lg": "1024px", // (min-width: 1024px)
  "xl": "1280px"  // (min-width: 1280px)
}
```

You may use any number of custom named screens. Just pass the your own custom `screens` object as part of the defaults when using VCalendar.

```js
import VCalendar from 'v-calendar';

Vue.use(VCalendar, {
  // ...some defaults
  screens: {
    tablet: '576px',
    laptop: '992px',
    desktop: '1200px',
  },
  // ...other defaults
})
```

Then, reference your custom screens when calling the `$screens` function.

```html
<v-calendar
  :columns="$screens({ default: 1, laptop: 2 })"
  />
```