---
title: 'Attributes'
sidebarDepth: 2
---

# Attributes

Attributes are what bring `v-calendar` to life. They are simply visual decorators that can be applied to specific calendar dates.

<guide-attributes-intro />

## Quick Guide

Let's start by displaying a simple **highlight** on today's date.

<guide-attributes-highlight/>

```html
<v-calendar :attributes='attrs' />
```

```js
export default {
  data() {
    return {
      attrs: [
        {
          key: 'today',
          highlight: true,
          dates: new Date(),
        },
      ],
    };
  },
};
```

For the simple example above, we used the following properties to build the attribute:

| Property | Description |
| --- | --- |
| **`key`** | Uniquely identifies the attribute. This will come in handly later. |
| **`highlight`** | Config for the highlighted region displayed on each date. |
| **`dates`** | Dates used to display the attribute. |

When simply assigning `true` to the highlight config (or any other attribute type except popovers), the currently active **theme** is used to display it. In this example, the theme is responsible to defining the default color (blue), fill mode, and content class for the highlight.

Here is how the default dot config would appear.

<guide-attributes-dot />

```js
export default {
  data() {
    return {
      attrs: [
        {
          key: 'today',
          dot: true,
          dates: new Date(),
        },
      ],
    };
  },
};
```

If you would like to use the active theme to display the attribute, just with a different color, pass a string with the desired color. Only included theme colors are supported (no hex values). Reference the theming guide for instructions on configuring your own theme.

<guide-attributes-highlight-color/>

```js
export default {
  data() {
    return {
      attrs: [
        {
          key: 'today',
          highlight: 'red',
          dates: new Date(),
        },
      ],
    };
  },
};
```

All attribute types (except popovers) allow using `true` or a theme color for its config value. Additionally, each attribute type supports its own unique configuration options using an object.

Click to learn more about the custom properties for [highlights](#highlights), [dots](#dots), [bars](#bars) and [popovers](#popovers).

Finally, let's quickly see how simple it is to add a popover label (or tooltip) to the previous example. All we need to do is add a popover object to our attribute.

<guide-attributes-popover />

```js{8-10}
export default {
  data() {
    return {
      attrs: [
        {
          key: 'today',
          highlight: true,
          popover: {
            label: 'You just hovered over today\'s date!',
          },
          dates: new Date(),
        },
      ],
    };
  },
};
```

## Attribute Types

The following attribute types are currently supported.

* Highlights (Highlighted Background Regions)
* Dot Indicators
* Bar Indicators
* Content Classes
* Popovers

Attributes are defined as an array of objects (each object is a separate attribute). Any one or more of these types may be included in a single attribute object.

Furthermore, a single attribute may be displayed for single dates, date ranges and even complex date patterns. Some examples of complex patterns include:
* Every other Friday
* 15th of every month
* Last Friday of every other month.

Here is the basic structure of attributes:

```html
<v-calendar
  :attributes='attributes'
  />
```

```js
...
data() {
  return {
    // Attributes are supplied as an array
    attributes: [
      // This is a single attribute
      {
        // An optional key can be used for retrieving this attribute later,
        // and will most likely be derived from your data object
        key: Any,
        // Attribute type definitions
        highlight: true,  // Boolean, String, Object
        dot: true,        // Boolean, String, Object
        bar: true,        // Boolean, String, Object
        content: 'red',   // Boolean, String, Object
        popover: { ... }, // Only objects allowed
        // Your custom data object for later access, if needed
        customData: { ... },
        // We also need some dates to know where to display the attribute
        // We use a single date here, but it could also be an array of dates,
        //  a date range or a complex date pattern.
        dates: new Date(),
        // You can optionally provide dates to exclude
        excludeDates: null,
        // Think of `order` like `z-index`
        order: 0
      }
    ];
  }
}
```

### Using `customData`

The `customData` property is used to link your own custom data object to the attribute. The reason you might want to use this property becomes obvious as you begin to use the plugin. For example, if a user clicks on a calendar day that is displaying the attribute, you might want to react to that that click, so you will need to know that data associated with that attribute.

### Using `order`

By default, attributes are ordered to display the most information possible. For example, when attributes with highlighted regions overlap, single date regions appear above date range regions, and date ranges with a later start date appear above those with an earlier start date. 

<p align='center'>
  <img src='https://res.cloudinary.com/dqgcfqzpk/image/upload/v1524511198/v-calendar/attributes-order.png' title='Ordering with highlights' width='200'>
</p>

If you would like to force an attribute to display above (or before) all others and override these rules, assign an order value greater than 0.

<!-- ### Using functions

Attributes are usually defined as objects (as shown above), but may also be defined as functions that accept an object parameter with the following properties and return a configured object.

| Property Name | Type    | Description |
| ------------- | ------- | ----------- |
| [`day`](/api/day-object.md) | Object | Object with specific information about the day displaying the attribute. |
| [`targetDate`](data.md#dateinfo--attributes-lifecycle) | Object | Date info object currently used to display attribute. |
| `isHovered` | Boolean | Day element is currently hovered over. |
| `isFocused` | Boolean | Day element is currently focused. Only applies when a popover is configured. |
| `onStart` | Boolean | Day lies on the first day of the attribute's `targetDate`. |
| `onEnd` | Boolean | Day lies on the last day of the attributes's `targetDate`. |
| `inBetween` | Boolean | Day is after the first day and before the last day of the attribute's `targetDate`. |

This allows for creating attributes that are more dynamic and responsive to the user's actions. For example, when the user hovers over the attribute, the function is re-evaluated and the attribute is automatically reconfigured.

Consider this example where an opacity is applied to a bar attribute when it is hovered. Notice that functions are used to define the bar instead of the attribute itself.

```html
<v-calendar
  :attributes='attributes'>
</v-calendar>
```

```js
export default {
  data() {
    return {
      attributes: [
        {
          bar({ isHovered }) {
            return {
              backgroundColor: 'black',
              opacity: isHovered ? 0.5 : 1,
            };
          },
          dates: new Date(),
        },
      ],
    };
  },
};
```

<ClientOnly>
  <guide-attributes-as-functions />
</ClientOnly> -->

## Highlights

As mentioned before, highlights may be configured using a simple boolean or string value.

```js
// 1A. Uses the default blue theme
highlight: true   

// Uses the red theme
highlight: 'red'
```

These are the additional configuration options you may use for further highlight customization:

| Property | Type | Description |
| --- | --- | --- |
| `color` | String | Theme color. |
| `fillMode` | String | Color fill option: `solid` (default), `light`, `none`. |
| `class` | String | Any generic class you wish to apply to the background element of the highlight |
| `contentClass` | String | Any generic class you wish to apply to the content element of the highlight |

Here is an example of using a more customized highlight to get a specific desired look.

<guide-attributes-highlight-custom />

```js
  // Customized highlight
  highlight: {
    color: 'purple',
    fillMode: 'light',
    contentClass: 'italic', // Class provided by TailwindCSS
  },
```

## Dots

Dots may be configured using a simple boolean or string value.

```js
// 1A. Uses the default blue theme
dot: true   

// Uses the red theme
dot: 'red'
```

These are the additional configuration options you may use for further dot customization:

| Property | Type | Description |
| --- | --- | --- |
| `color` | String | Theme color. |
| `class` | String | Any generic class you wish to apply to the dot dom element. |

<guide-attributes-dots />

```html
<v-calendar
  :columns="$screens({ lg: 2 }, 1)"
  :from-date="new Date(2018, 0, 1)"
  :attributes="attributes"
  />
```

```js
export default {
  data() {
    return {
      attributes: [
        {
          dot: {
            color: 'red',
            class: 'my-dot-class',
          },
          dates: [
            new Date(2018, 0, 1), // Jan 1st
            new Date(2018, 0, 10), // Jan 10th
            new Date(2018, 0, 22), // Jan 22nd
          ],
        },
        {
          dot: 'green',
          dates: [
            new Date(2018, 0, 4), // Jan 4th
            new Date(2018, 0, 10), // Jan 10th
            new Date(2018, 0, 15), // Jan 15th
          ],
        },
        {
          dot: 'purple',
          dates: [
            new Date(2018, 0, 12), // Jan 12th
            new Date(2018, 0, 26), // Jan 26th
            new Date(2018, 0, 15), // Jan 15th
          ],
        },
      ],
    };
  },
};
```

## Bars

Bars may be configured using a simple boolean or string value. When more than one bar is dislayed per calendar day, they are equally spaced amongst each other. As a result, it might be a good idea to limit displaying up to 2 to 3 bars per day cell, as legibility can suffer.

```js
// 1A. Uses the default blue theme
bar: true   

// Uses the red theme
bar: 'red'
```

These are the additional configuration options you may use for further bar customization:

| Property | Type | Description |
| --- | --- | --- |
| `color` | String | Theme color. |
| `class` | String | Any generic class you wish to apply to the bar dom element. |

<guide-attributes-bars />

```html
<v-calendar
  :columns="$screens({ lg: 2 }, 1)"
  :from-date="new Date(2018, 0, 1)"
  :attributes="attributes"
  />
```

```js
export default {
  data() {
    return {
      attributes: [
        {
          bar: {
            color: 'red',
            class: 'my-dot-class',
          },
          dates: [
            new Date(2018, 0, 1), // Jan 1st
            new Date(2018, 0, 10), // Jan 10th
            new Date(2018, 0, 22), // Jan 22nd
          ],
        },
        {
          bar: 'green',
          dates: [
            new Date(2018, 0, 4), // Jan 4th
            new Date(2018, 0, 10), // Jan 10th
            new Date(2018, 0, 15), // Jan 15th
          ],
        },
        {
          bar: 'purple',
          dates: [
            new Date(2018, 0, 12), // Jan 12th
            new Date(2018, 0, 26), // Jan 26th
            new Date(2018, 0, 15), // Jan 15th
          ],
        },
      ],
    };
  },
};
```

## Popovers

There are 2 basic approaches to displaying popovers within attributes.

### 1. Labels

Labels are the basic tooltip-style popover. They are configured as simple strings. By default, these popovers display when the user hovers over the day content and additionaly are not interactive to the user.

<guide-attributes-popover-labels />

```html
<template>
  <v-calendar
    :attributes='attributes'
    />
</template>
```

```js
export default {
  data() {
    const todos = [
      {
        description: 'Take Noah to basketball practice.',
        isComplete: false,
        dates: { weekdays: 6 }, // Every Friday
        color: 'red',
      },
    ];
    return {
      incId: todos.length,
      todos,
    };
  },
  computed: {
    attributes() {
      return [
        // Attributes for todos
        ...this.todos.map(todo => ({
          dates: todo.dates,
          dot: {
            color: todo.color,
            class: todo.isComplete ? 'opacity-75' : '',
          },
          popover: {
            label: todo.description,
          },
          customData: todo,
        })),
      ];
    },
  },
};
```

For this example, we simply assigned a string to the `popover.label` property. This signals to `v-calendar` that it needs to display the label in a popover whenever the user hovers over the day content (or taps on mobile).

If we want to force the user to click on the day content in order to display the popover, we can set the popover's `visibility` property to `"focus"` or `"click"`.

<guide-attributes-popover-labels visibility="focus" />

```js
    ...
    popover: {
      label: todo.description,
      visibility: 'focus'
    }
    ...
```

<guide-attributes-popover-labels visibility="click" />

```js
    ...
    popover: {
      label: todo.description,
      visibility: 'click'
    }
    ...
```

Also, you'll notice there is a small indicator next to the popover content row for the attribute. This is a simple indicator provided in order to help the user match up the popover content rows to the indicators in the calendar day cell. The indicator will try to coordinate the colors and shapes as closely as possible.

In the previous example, because a red dot was used, the indicator displays the same.

<p align='center'>
  <img src='https://res.cloudinary.com/dqgcfqzpk/image/upload/v1524521268/v-calendar/popover-indicator-dot.png' title='Popover dot indicator' width='100'>
</p>

Here is how a bar or highlight would appear, respectively.

<p align='center'>
  <img src='https://res.cloudinary.com/dqgcfqzpk/image/upload/v1524521268/v-calendar/popover-indicator-bar.png' title='Popover bar indicator' width='100'>
  <img src='https://res.cloudinary.com/dqgcfqzpk/image/upload/v1524521268/v-calendar/popover-indicator-highlight.png' title='Popover highlight indicator' width='105'>
</p>

If you would like to hide the indicator, just set the `hideIndicator` property to `true`;

<guide-attributes-popover-labels hide-indicators />

```js
    ...
    popover: {
      label: todo.description,
      visibility: 'focus',
      hideIndicator: true,
    }
    ...
```

These are the additional configuration options you may use for further popover customization:

| Property | Type | Description |
| --- | --- | --- |
| `label` | String | Content to display in the popover. |
| `labelClass` | String | Class to apply to the label. |
| `labelStyle` | Object | Inline style to apply to the label. |
| `hideIndicator` | Boolean | Hides the indicator that appears to the left of the label. |
| `visibility` | String | Visibility mode for the popover (`"hover"`, `"focus"`, `"click"`, `"visible"`, `"hidden"`).
| `isInteractive` | Boolean | Allows user to interactive with the popover contents. For example, this keeps the popover open when user hovers over the popover when `visibility === "hover"`, instead of hiding it by default. |

### 2. Scoped Slot

For a more customized approach you can insert your own `"day-popover"` custom scoped slot within `v-calendar`.

::: tip
If you are not familiar with the convention of using scoped slots in Vue.js, you can reference the [Vue docs](https://vuejs.org/v2/guide/components.html#Scoped-Slots) or [this post by alligator.io](https://alligator.io/vuejs/scoped-component-slots/).
:::

<guide-attributes-popover-slot />

```html
<v-calendar
  :attributes="attributes"
  >
  <div slot="day-popover" slot-scope="">
    Using my own content now
  </div>
</v-calendar>
```

Notice that displaying static content here probably isn't going to help you much.

Now that you are providing your own popover, you need to display the attributes on your own. Fortunately, the following `slot-scope` props should provide you with everything you need to help you display content for your custom data.

| Property | Type | Description |
| -------- | ---- | ----------- |
| `day` | Object | The [day object](/api/day-object.md) associated with the popover. |
| `attributes` | Array | All the attributes assigned for the associated day. Only attributes with 'truthy' values assigned to their `popover` key are passed in. |
| `format` | Function | Function for formatting dates. Accepts `date: Date` and `mask: String` arguments, respectively. |
| `masks` | Object | Set of format masks for the calendar. |
| `updateLayout` | Function | Call this function to force the popover to recalculate its layout. For example, making changes to elements within popover could cause it to grow or shrink. Calling this function will keep it positioned correctly. |
| `hide` | Function | Call this function to forcefully hide the popover. |

Let's walk through the process of customizing the previous example. First, let's add a header to display the date for the popover.

<guide-attributes-popover-slot :step="2" />

```html
<v-calendar :attributes="attributes">
  <div slot="day-popover" slot-scope="{ day, format, masks }">
    <div class="text-xs text-gray-300 font-semibold text-center">
      {{ format(day.date, masks.dayPopover) }}
    </div>
  </div>
</v-calendar>
```

For the header, we use the `format` function to format the date for the current `day`, using the default `dayPopover` mask. Note: you could also just use your own custom mask.

Because this technique for displaying the header is common, you can extract the pre-formatted `dayTitle` property.

```html
<v-calendar :attributes="attributes">
  <div slot="day-popover" slot-scope="{ day, dayTitle }">
    <div class="text-xs text-gray-300 font-semibold text-center">
      {{ dayTitle }}
    </div>
  </div>
</v-calendar>
```

Now, we just need to display the attributes for the day as well. We can do so by extracting the `attributes` array from the slot-scope expression. We'll use a simple list to display the attribute data.

<guide-attributes-popover-slot :step="3" />

```html
<v-calendar :attributes="attributes">
  <div
    slot="day-popover"
    slot-scope="{ day, dayTitle, attributes }">
    <div class="text-xs text-gray-300 font-semibold text-center">
      {{ dayTitle }}
    </div>
        <ul>
          <li
            v-for="{key, customData} in attributes"
            :key="key">
            {{ customData.description }}
          </li>
        </ul>
  </div>
</v-calendar>
```

Finally, if you wish to display indicators with your custom content, you can use the `v-popover-row` component included with the plugin. Just pass in the attribute for each row.

<guide-attributes-popover-slot :step="4" />

```html
<v-calendar :attributes="attributes">
  <div
    slot="day-popover"
    slot-scope="{ day, dayTitle, attributes }">
    <div class="text-xs text-gray-300 font-semibold text-center">
      {{ dayTitle }}
    </div>
    <v-popover-row
      v-for="attr in attributes"
      :key="attr.key"
      :attribute="attr">
      {{ customData.description }}
    </v-popover-row>
  </div>
</v-calendar>
```

## Working With Dates

Understanding how to configure dates and date patterns is a critical part to using attributes. In this section, we'll cover all the options that are at your disposal to efficiently display attributes.

### Single Dates

In the previous example, we saw that all we had to do was use a simple date object assigned to the `dates` property.

<guide-attributes-highlight/>

```js
...
data() {
  return {
    attributes: [
      {
        key: 'today',
        highlight: true,
        dates: new Date()
      }
    ]
  }
}
```

### Multiple Dates

We aren't limited to using single dates. We can also specify an array of dates.

<guide-attributes-multiple-dates/>

```js
  ...
  dates: [ new Date(2018, 0, 1), new Date(2018, 0, 15) ]
  ...
```

### Date Ranges

Date ranges are also allowed. They are expressed as a simple object with the following properties:

| Property | Description |
| --- | --- |
| `start` | Date that defines the start of the date range |
| `end` | Date that defined the end of the date range (optional) |
|`span` | Number of days to extend the range after the start date (optional). This may be used instead of the `end` date. |

<guide-attributes-date-ranges/>

```js
  ...
  dates: [
    { start: new Date(2018, 0, 1), end: new Date(2018, 0, 5) },
    { start: new Date(2018, 0, 15), span: 5 } // # of days
  ]
  ...
```

Use `null` you would like to to specify an infinite start or end date.

<guide-attributes-date-range-no-start/>

```js
  ...
  dates: {
    start: null, // From the beginning of time
    end: new Date() // Until today
  }
  ...
```

Optionally, if using `null` dates, you can omit them entirely.

```js
...
dates: {
  end: new Date() // Same as before
}
...
```

Thus, an empty object is a valid date expression...

<guide-attributes-date-range-no-start-end/>

```js
  ...
  // From the beginning of time until the end of time
  dates: {},
  ...
```

### Targeting Range Sections

When using date ranges to display highlights, dots, bars, and content classes, you may target specific sections of those ranges.

For example, consider the following date range using to display a highlight.

<guide-attributes-highlight-range />

```html
<v-calendar
  :from-page="{ month: 1, year: 2019}"
  :attributes="attrs"
  />
```

```js
export default {
  data() {
    return {
      attrs: [
        {
          highlight: true,
          dates: {
            start: new Date(2019, 0, 14),
            end: new Date(2019, 0, 18)
          },
        },
      ],
    };
  },
};
```

By default, `v-calendar` uses a light `fillMode` for the base highlight and a solid `fillMode` for the start and end of the highlight.

By specifying unique target areas for the highlight, we can override this behavior.

<guide-attributes-highlight-range :base="{ fillMode: 'solid' }" />

```html
<v-calendar :attributes="attrs" />
```

```js{6-7}
export default {
  data() {
    return {
      attrs: [
        highlight: {
          // Override light fillMode for base
          base: { fillMode: 'solid' },
        },
        dates: {
          start: new Date(2019, 0, 14),
          end: new Date(2019, 0, 18)
        },
      ]
    };
  }
};
```

Here the `start` and `end` targets are configured as objects with the `fillMode` property set to `solid`. Here are all of the attribute areas that may be targeted.

| Key | Target Area |
| --- | ----------- |
| `base` | Entire span of the date region |
| `start` | First day of the date region |
| `end` | Last day of the date region |
| `startEnd` | First and last day of the date region |

For highlights, when targeting the `start`, `end` and `startEnd` areas, a second background is laid on top of the base background. For all other attributes, they serve as a replacement for the `base` area.

Any settings that apply for the `highlight` may also be applied to each target area.


```js

highlight: {
  base: true,
  startEnd: true
}

highlight: {
  base: 'red',
  startEnd: 'red',
}

```

### Date Patterns

The third kind of date expression is date patterns. They can target dates that would be incredibly difficult, if not impossible, to do otherwise with simple dates or date ranges. To configure a date pattern, let's first start with a date range.

```js
{
  start: new Date(2018, 0, 1),  // Jan 1st, 2018
  end: new Date(2019, 0, 1)     // Jan 1st, 2019
}
```

The only thing we need to do to convert this date range into a date pattern is to start adding patterns to it. For this simple example, we'll just target the weekends.

<guide-attributes-date-patterns/>

```js
{
  start: new Date(2018, 0, 1),  // Jan 1st, 2018
  end: new Date(2019, 0, 1)     // Jan 1st, 2019
  weekdays: [1, 7]              // ...on Sundays and Saturdays
}
```

We can also target other specific day properties, like `days: [6, 15]` for the 6th and 15th of the month, `weeks: [-1]` for the last week of the month and even `ordinalWeekdays: { [-1]: 1 }` for the last Sunday of the month.

Consider another example of displaying dot indicators on the last Friday of every other month, starting on January 1st of 2018. We could do so like this.

<guide-attributes-date-patterns-1 />

```js
...
  attrs: [
    {
      dot: 'red',
      dates: {
        start: new Date('1/1/2018'),
        monthlyInterval: 2,           // Every other month
        ordinalWeekdays: { [-1]: 6 }  // ...on the last Friday
      }
    }
  ]
...
```

Now, for some reason, we also want to display them on the 15th of every other month, so our first attempt might be to modify the dates to this:

```js{6}
...
dates: {
  start: new Date('1/1/2018'),
  monthlyInterval: 2,           // Every other month
  ordinalWeekdays: { [-1]: 6 }, // ...on the last Friday
  days: 15                      // ...and on the 15th? (WRONG!)
},
...
```

But this would be **wrong**, because all component specifiers are conditionally *anded* with each other.

To evaluate a set of conditions *or* another set, we can break the sets of conditions out into an array assigned to the `on` property.

```js{5-8}
...
dates: {
  start: new Date('1/1/2018'),
  monthlyInterval: 2,                 // Every other month
  on: [                               // ...on...
    { ordinalWeekdays: { [-1]: 6 } }, // ...the last Friday
    { days: 15 }                      // ...or the 15th of the month
  ]
}
...
```

Note how we kept the `monthlyInterval` condition outside of the others. Any conditions that should be **anded** with all the others can be extracted out of the array. This prevents unnecessary duplication of conditions within the array.

Here is a complete reference of date component specifiers available.

| Property | Type | Description | Range |
| --- | --- | --- | --- |
| `days` | Number, Array | Day number from the start or end of the month. | 1 to 31, -1 to -31 |
| `weekdays` | Number, Array | Day of the week. | 1: Sun to 7: Sat |
| `ordinalWeekdays` | Object (key: Number / value: Number, Array) | Weekday ordinal position from the start or end of the month. | key: 1 to 6, -1 to -6 / value: 1: Sun to 7: Sat |
| `weeks` | Number, Array | Week number from the start or end of the month. | 1 to 6, -1 to -6 |
| `months` | Number, Array | Months of the year. | 1 to 12 |
| `years` | Number, Array | Year numbers. | 4-digit integer |
| `dailyInterval` | Number | Interval number of days from the start date (or today when no start date provided). | n > 0 |
| `weeklyInterval` | Number | Interval number of weeks from the start date (or today). | n > 0 |
| `monthlyInterval` | Number | Interval number of months from the start date (or today). | n > 0 |
| `yearlyInterval` | Number | Interval number of years from the start date (or today). | n > 0 |

### Include vs Exclude Dates

Currently, there are four props where you can use date expressions:
  * [`dates`](/api/attribute.md#dates): Date or date range objects (patterns supported) to include for the attributes.
  * [`exclude-dates`](/api/attribute.html#excludedates): Date or date range objects (patterns supported) to exclude for attributes. All other dates are included.
  * [`disabled-dates`](/api/datepicker.html#disabled-dates) Disabled dates for `v-date-picker`.
  * [`available-dates`](/api/datepicker.html#available-dates) Available dates for `v-date-picker`. All other dates are disabled.

In both occasions where date expressions are used (attributes and `v-date-picker`), you'll notice that they come in pairs. One expression is for the explicit form (`dates` for attributes, `disabled-dates` for `v-date-picker`), and the other expression is for the implicit form (`exclude-dates` for attributes, `available-dates` for `v-date-picker`).

The explicit form is the most direct form of expressing what dates you want; you give it the date and the calendar displays the attribute on (or the date picker disables) that date.

However, it might be more efficient to express what dates you would like to exclude, or avoid. For example, in `v-date-picker`, if you only want to allow date selections in the month of January of 2018, both of these expressions would work:

```html
<v-date-picker
  v-model='myDate'
  :disabled-dates='[
    {
      start: null,
      end: new Date(2017, 11, 31)
    },
    {
      start: new Date(2018, 1, 1),
      end: null
    }
  ]'>
</v-date-picker>
```

```html
<v-date-picker
  v-model='myDate'
  :available-dates='{
    start: new Date(2018, 0, 1),
    end: new Date(2018, 0, 31)
  }'>
</v-date-picker>
```

As you can see, the second expression is more terse and declarative than the first. It even performs slighly better. The point is, just take a second to consider which method is best suited for your application.
