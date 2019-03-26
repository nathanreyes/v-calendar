# Migration Guide

::: tip
This guide discusses all *breaking changes* made for new versions >= v0.8.0. It does not cover all new features. Please refer to the [changelog](https://github.com/nathanreyes/v-calendar/blob/master/CHANGELOG.md) for more info.
:::

## v1.0.0-beta.1

This is a big update with quite a few breaking changes. Here are the biggest updates.

#### Layouts

In pre-v1 versions, you could just create double-paned calendars via the `is-double-paned` and `is-vertical` props. While better than nothing, only getting 2 columns with 1 row kind of sucked and the built-in responsiveness was not great. Now, you have multiple props to configure your own layouts.

| | Type | Description |
| --- | --- | --- |
| `rows` | Number | Number of calendar pane rows |
| `columns` | Number | Number of calendar pane columns |

For responsive designs, you can use the newly provided `$screens` function to make these props (or any other prop for that matter) responsive. For example, this will get you 2 columns and 2 rows on large layouts.
```html
<v-calendar
  :rows="$screens({ default: 1, lg: 2 })"
  :columns="$screens({ default: 1, lg: 2 })"
  />
```

One extra nicety: because this function is provided via a lightweight mixin, you can use it to make any prop on any component responsive.

[Read more about creating responsive layouts.](./readme.md#responsive-layouts)

#### i18n Improvements

Previously, you could only define a single locale for use by all instances of `v-calendar` in your application. Now, you can pass a `locale` prop to each instance of `v-calendar`. It can either be a locale string identifier or an object with your own custom localized settings. If you don't provide a `locale` prop, it still reverts to the locale detected by the browser.

Also, you can provide a locales object within your own defaults to provide info for any locales not natively detected by `v-calendar` or the browser.

[Read more about working with i18n.](./readme.md#i18n)

## v0.9.0

* Theme styles ~~`headerVerticalDivider`~~, ~~`weekdaysVerticalDivider`~~ and ~~`weeksVerticalDivider`~~ removed in favor of defining functions for the `header`, `weekdays` and `weeks` styles like so...

```html
<template>
  <v-calendar :theme-styles='themeStyles'>
  </v-calendar>
</template>
```

```javascript
export default {
  data() {
    return {
      themeStyles: {
        // Use page position to set left border for the 2nd pane header
        // NOTE: You can use the `verticalDivider` style to apply a single border. Just use this technique to apply different border styles for specific sections (header, weekdays, weeks)
        header({ position }) {
          return (position === 2) && {
            borderLeft: '1px solid #dadada'
          };
        }
      }
    }
  }
}
```

## v0.8.0

### Date Picker Day Popover

  * Renamed `v-date-picker` prop `show-popover` to `show-day-popover` to avoid confusion with calendar popover.
  * Renamed defaults property `datePickerShowPopover` to `datePickerShowDayPopover` to avoid confusion with calendar popover.

### Attribute Functions

Attribute types can now be defined as functions that accept an object parameter with the following properties and return an object.

| Property Name | Type    | Description |
| ------------- | ------- | ----------- |
| `day` | Object | Object with specific information about the day displaying the attribute. |
| `targetDate` | Object | Date info object. |
| `isHovered` | Boolean | Day element is currently hovered over. |
| `isFocused` | Boolean | Day element is currently focused. Only applies when a popover is configured. |
| `onStart` | Boolean | Day lies on the first day of the attribute's `targetDate`. |
| `onEnd` | Boolean | Day lies on the last day of the attributes's `targetDate`. |

For example, you could fade a bar attribute when the day content is hovered.

```html
<v-calendar
  :attributes='attributes'>
</v-calendar>
```

```javascript
export default {
  data() {
    return {
      attributes: [
        {
          bar({ isHovered }) {
            return {
              backgroundColor: "black",
              opacity: (isHovered && 0.5) || 1
            };
          },
          dates: new Date()
        }
      ]
    };
  }
};
```

As a result of this change, the `attribute.contentHoverStyle` property has been deprecated in favor of using a function for `attribute.contentStyle`. This allows for more flexibility and control for configuring the style.

```html
<v-calendar
  :attributes='attributes'>
</v-calendar>
```

```javascript
export default {
  data() {
    return {
      attributes: [
        {
          contentStyle({ isHovered }) {
            return (
              isHovered && {
                backgroundColor: "#dadada",
                cursor: "pointer"
              }
            );
          },
          dates: new Date()
        }
      ]
    };
  }
};
```

Also, the `dayContentHover` theme style has been deprecated in favor of using a function to define the `contentStyle`, just like in the previous example.
