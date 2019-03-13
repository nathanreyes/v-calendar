---
title: 'Attributes'
sidebarDepth: 2
---

# Attributes

Attributes are what bring `v-calendar` to life. They are simply visual decorators that can be applied to specific calendar dates.

<ClientOnly>
  <guide-attributes-intro />
</ClientOnly>

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

```js{13-15}
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

```javascript
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
  <img src='http://res.cloudinary.com/dqgcfqzpk/image/upload/v1524511198/v-calendar/attributes-order.png' title='Ordering with highlights' width='200'>
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

```javascript
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

## Working With Dates

Understanding how to configure dates and date patterns is a critical part to using attributes. In this section, we'll cover all the options that are at your disposal to efficiently display attributes.

### Single Dates

In the previous example, we saw that all we had to do was use a simple date object assigned to the `dates` property.

<guide-attributes-highlight/>

```javascript
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

```javascript
  ...
  dates: {
    start: null, // From the beginning of time
    end: new Date() // Until today
  }
  ...
```

Optionally, if using `null` dates, you can omit them entirely.

```javascript
...
dates: {
  end: new Date() // Same as before
}
...
```

Thus, an empty object is a valid date expression...

<guide-attributes-date-range-no-start-end/>

```javascript
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

| Key | Target Area |
| --- | ----------- |
| `base` | Base background layer applied to entire span of the highlight |
| `baseStart` | First day of the highlight span on the base layer |
| `baseEnd` |  Last day of the highlight span on the base layer |
| `baseStartEnd` | First or last day of the highlight span on the base layer |
| `start` | First day of the highlight span on an overlaid layer |
| `end` | Last day of the highlight span on an overlaid layer |
| `startEnd` | First or last day of the highlight span on and overlaid layer |

For highlights, when targeting the `start`, `end` and `startEnd` sections, a second background is laid on top of the base background.

[Insert picture here]

Any settings that apply for the `highlight` may also be applied to each subsection.


```js

// 2A. Produces same result as 1A
highlight: {
  base: true,
  startEnd: true
}

// 2B. Produces same result as 1B
highlight: {
  base: 'red',
  startEnd: 'red',
}

// 2C. Produces same result as 2B, but without the end caps
highlight: {
  base: 'red'
}
```

<!-- <ClientOnly>
  <guide-attributes-highlights />
</ClientOnly> -->

### Date Patterns

The third kind of date expression is date patterns. They can target dates that would be incredibly difficult, if not impossible, to do otherwise with simple dates or date ranges. To configure a date pattern, let's first start with a date range.

```javascript
{
  start: new Date(2018, 0, 1),  // Jan 1st, 2018
  end: new Date(2019, 0, 1)     // Jan 1st, 2019
}
```

The only thing we need to do to convert this date range into a date pattern is to start adding patterns to it. For this simple example, we'll just target the weekends.

<guide-attributes-date-patterns/>

```javascript
{
  start: new Date(2018, 0, 1),  // Jan 1st, 2018
  end: new Date(2019, 0, 1)     // Jan 1st, 2019
  weekdays: [1, 7]              // ...on Sundays and Saturdays
}
```

We can also target other specific day properties, like `days: [6, 15]` for the 6th and 15th of the month, `weeks: [-1]` for the last week of the month and even `ordinalWeekdays: { [-1]: 1 }` for the last Sunday of the month.

Consider another example of displaying dot indicators on the last Friday of every other month, starting on January 1st of 2018. We could do so like this.

```javascript
...
  attrs: [
    {
      dot: { backgroundColor: 'red' },
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

```javascript
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

```javascript
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

Currently, there are four props where you can use date expressions:
  * [`dates`](/api/attribute.md#dates): Date or date range objects (patterns supported) to include for the attributes.
  * [`exclude-dates`](/api/attribute.html#excludedates): Date or date range objects (patterns supported) to exclude for attributes. All other dates are included.
  * [`disabled-dates`](/api/datepicker.html#disabled-dates) Disabled dates for `v-date-picker`.
  * [`available-dates`](/api/datepicker.html#available-dates) Available dates for `v-date-picker`. All other dates are disabled.

### Explicit vs Implicit

In both occasions where date expressions are used (attributes and `v-date-picker`), you'll notice that they come in pairs. One expression is for the explicit form (`dates` for attributes, `disabled-dates` for `v-date-picker`), and the other expression is for the implicit form (`exclude-dates` for attributes, `available-dates` for `v-date-picker`).

The explicit form is the most direct form of expressing what dates you want; you give it the date and the calendar displays the attribute on (or the date picker disables) that date.

However, it might be more efficient to express what dates you would like to exclude, or avoid. For example, in `v-date-picker`, if you only want to allow date selections in the month of January of 2018, both of these expressions would work:

```html
<v-date-picker
  v-model='myDate'
  :disabled-dates='[{ start: null, end: new Date(2017, 11, 31)}, { start: new Date(2018, 1, 1), end: null }]'>
</v-date-picker>
```

```html
<v-date-picker
  v-model='myDate'
  :available-dates='{ start: new Date(2018, 0, 1), end: new Date(2018, 0, 31) }'>
</v-date-picker>
```

As you can see, the second expression is more terse and declarative than the first. It even performs slighly better. The point is, just take a second to consider which method is best suited for your application.

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

```javascript
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

```javascript
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

Popovers provide unique opportunities for users to interact with your web applications. Displaying rich content or supporting inline editing are two such use cases. They come with lots of configurability built-in, including how and when they are displayed as well as how users should be allowed to interact with them.

Popovers are configured on a per-attribute basis. That is, each attribute may configure its own popover content row. If two or more attributes have assigned popovers on the same day, the two rows are simply concatenated and displayed together in the same popover content window (the order of which is determined by the attribute's `order` property).

Popovers come in two basic flavors:

### Labels

Labels are the basic tooltip-style popover. They are configured as simple strings. By default, these popovers display when the user hovers over the day content and additionaly are not interactive to the user.

Consider the following example:

<guide-attributes-popover-labels />

```html
<template>
  <v-calendar
    :attributes='attributes'
    />
</template>
```

```javascript
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
        })),
      ];
    },
  },
};
```

For this example, we simply assigned a string to the `popover.label` property. This signals to `v-calendar` that it needs to display the label in a popover whenever the user hovers over the day content (or taps on mobile).

If we want to force the user to click on the day content in order to display the popover, we can set the popover's `visibility` property to `"focus"` or `"click"`.

<guide-attributes-popover-labels visibility="focus" />

```javascript
    ...
    popover: {
      label: todo.description,
      visibility: 'focus'
    }
    ...
```

<guide-attributes-popover-labels visibility="click" />

```javascript
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
  <img src='http://res.cloudinary.com/dqgcfqzpk/image/upload/v1524521268/v-calendar/popover-indicator-dot.png' title='Popover dot indicator' width='100'>
</p>

Here is how a bar or highlight would appear, respectively.

<p align='center'>
  <img src='http://res.cloudinary.com/dqgcfqzpk/image/upload/v1524521268/v-calendar/popover-indicator-bar.png' title='Popover bar indicator' width='100'>
  <img src='http://res.cloudinary.com/dqgcfqzpk/image/upload/v1524521268/v-calendar/popover-indicator-highlight.png' title='Popover highlight indicator' width='105'>
</p>

If you would like to hide the indicator, just set the `hideIndicator` property to `true`;

<guide-attributes-popover-labels hide-indicators />

```javascript
    ...
    popover: {
      label: todo.description,
      visibility: 'focus',
      hideIndicator: true,
    }
    ...
```

### Scoped Slots

Scoped slots provide a more advanced method of displaying popover content for attributes. Just insert scoped slots within `v-calendar` with unique names that can be referenced by popover objects created in your Javascript code.

In the previous example, we used simple popover labels to display todos in the calendar. This is a nice feature, but it would be *really* nice to allow the user to mark todos as completed or edit the todo description directly in the calendar itself. We can do this using slots.

<ClientOnly>
  <guide-attributes-popover-slots>
  </guide-attributes-popover-slots>
</ClientOnly>

#### Step 1: Create the slot in the template

First, we need to define a slot to be used by one or more attribute popovers. To do this, we can just create a scoped slot with a name that doesn't clash with one of `v-calendar`'s [existing slot names](/api/calendar.md#scoped-slots).

For our example, we'll create a slot with the name of `"todo-row"`. For our benefit, this slot is supplied with the following props which we can reference via the `slot-scope` element attribute:

| Property | Description |
| -------- | ----------- |
| `attribute` | The attribute object associated with the popover content row. |
| `customData` | The custom data associated with the attribute above. Shortcut for `attribute.customData`. |
| `day` | The [day object](/api/day-object.md) associated with the popover. |
| `format` | Function for formatting dates. Accepts `date: Date` and `format: String` arguments, respectively. |

::: tip
If you are not familiar with the convention of using scoped slots in Vue.js, you can reference the [Vue docs](https://vuejs.org/v2/guide/components.html#Scoped-Slots) or [this post by alligator.io](https://alligator.io/vuejs/scoped-component-slots/).
:::


```html
<template>
  <v-calendar
    :from-date='new Date(2018, 0, 1)'
    :attributes='attributes'>
    <!--===============TODO ROW SLOT==============-->
    <div
      slot='todo-row'
      slot-scope='{ customData }'
      class='flex flex-no-wrap items-center w-full'>
      <!--Todo content-->
      <div class='flex-grow'>
        <!--Show textbox when editing todo-->
        <input
          class='appearance-none bg-white border p-1'
          :style='{ minWidth: "220px" }'
          v-if='customData.id === editId'
          v-model='customData.description'
          @keyup.enter='editId = 0'
          v-focus-select />
        <!--Show status/description when not editing-->
        <span
          v-else>
          <!--Completed checkbox-->
          <input
            type='checkbox'
            v-model='customData.isComplete' />
          <!--Description-->
          <span
            class='ml-1 cursor-pointer'
            :class='{ "line-through": customData.isComplete }'
            @click='toggleTodoComplete(customData)'>
            {{ customData.description }}
          </span>
        </span>
      </div>
      <!--Edit/Done buttons-->
      <a
        @click.prevent='toggleTodoEdit(customData)'
        class='ml-1 cursor-pointer'>
        <!--Edit button-->
        <svg
          v-if='editId !== customData.id'
          class='fill-current text-blue-5'
          viewBox='0 0 20 20'
          width='12'
          height='12'>
          <path d='M12.3 3.7l4 4L4 20H0v-4L12.3 3.7zm1.4-1.4L16 0l4 4-2.3 2.3-4-4z'/>
        </svg>
        <!--Done button-->
        <svg
          v-else
          class='fill-current text-green-5'
          viewBox='0 0 20 20'
          width='12'
          height='12'>
          <path d='M0 11l2-2 5 5L18 3l2 2L7 18z'/>
        </svg>
      </a>
      <!--Delete button-->
      <a
        @click.prevent='deleteTodo(customData)'
        v-if='!editId || editId !== customData.id'
        class='ml-1 cursor-pointer'>
        <svg
          class='fill-current text-red-6'
          viewBox='0 0 20 20'
          width='12'
          height='12'>
          <path d='M10 8.586L2.929 1.515 1.515 2.929 8.586 10l-7.071 7.071 1.414 1.414L10 11.414l7.071 7.071 1.414-1.414L11.414 10l7.071-7.071-1.414-1.414L10 8.586z'/>
        </svg>
      </a>
    </div>
  </v-calendar>
</template>
```

#### Step 2: Reference the slot from the attribute's popover object

Once we have created the uniquely named slot, all we need to do is reference that name from the `popover.slot` property.

```js{65}
const color = '#ff8080';
const todos = [
  {
    id: 1,
    description: 'Take Noah to basketball practice.',
    isComplete: false,
    dates: new Date(2018, 0, 1),
  },
  {
    id: 2,
    description: 'Get some milks.',
    isComplete: false,
    dates: new Date(2018, 0, 5),
  },
  {
    id: 3,
    description: 'Pay the utility bill.',
    isComplete: false,
    dates: new Date(2018, 0, 19),
  },
  {
    id: 4,
    description: 'Pick up clothes from the cleaners.',
    isComplete: false,
    dates: new Date(2018, 0, 19),
  },
  {
    id: 5,
    description: 'Lunch with Leo.',
    isComplete: false,
    dates: new Date(2018, 0, 22),
  },
];

export default {
  data() {
    return {
      incId: todos.length,
      editId: 0,
      todos,
    };
  },
  computed: {
    attributes() {
      return [
        // Today attribute
        {
          contentStyle: {
            fontWeight: '700',
            color: '#66b3cc',
          },
          dates: new Date(),
        },
        // Todo attributes
        ...this.todos.map(todo => ({
          key: todo.id,
          dates: todo.dates,
          customData: todo,
          order: todo.id,
          dot: {
            backgroundColor: color,
            opacity: todo.isComplete ? 0.3 : 1,
          },
          popover: {
            slot: 'todo-row', // Matches slot from above
          },
        })),
      ];
    },
  },
  methods: {
    toggleTodoComplete(todo) {
      todo.isComplete = !todo.isComplete;
    },
    toggleTodoEdit(todo) {
      this.editId = this.editId === todo.id ? 0 : todo.id;
    },
    deleteTodo(todo) {
      this.todos = this.todos.filter(t => t !== todo);
    },
  },
  directives: {
    focusSelect: {
      inserted(el) {
        el.focus();
        el.select();
      },
    },
  },
};
```

<ClientOnly>
  <guide-attributes-popover-slots>
  </guide-attributes-popover-slots>
</ClientOnly>

Let's note a few things from the example above:

  1. We reference the attribute's `customData` via the `slot-scope` in order to properly display and edit the todo.
  2. From within the slot, we can now call methods to delete and edit the todo using the `customData`.
  3. From within the methods, we can mutate the list of todos (when deleting) or the todo itself (when marking complete or editing description).
  4. These edits modify the state of the todos array. The attributes are then re-computed from this array and the UI is updated accordingly.

Before wrapping up this example, we still need to add a custom day header and implement a way to add new todos. To do this, we'll utilize 2 new slots
* **`day-popover-header`**: Slot used for displaying the day header
* **`add-to`**: Slot with button for adding a new todo

```html
  ...
  <!--=========DAY POPOVER HEADER SLOT=========-->
  <div
    slot="day-popover-header"
    slot-scope="{ day, format }"
    class="text-center pb-1 mb-1 border-b mx-1">
    {{ format(day.date, "WWW, MMM D, YYYY") }}
  </div>
  <!--===============TODO ROW SLOT==============-->
  ...
  ...
  ...
  <!--================ADD TODO ROW SLOT===============-->
  <div
    slot='add-todo'
    slot-scope='{ day }'
    class='text-center w-full cursor-pointer'>
    <a @click='addTodo(day)'>
      + Add Todo
    </a>
  </div>
  ...
```

Then we can add the new 'Add Todo' attribute to the attributes list.

```javascript
...
computed: {
  attributes: [
    // Today attribute
    ...
    // Todo attributes
    ...
    // 'Add Todo' attribute
    {
      contentHoverStyle: {
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        cursor: 'pointer',
      },
      dates: {}, // All dates
      popover: {
        slot: 'add-todo',
        hideIndicator: true,
      }
    }
  ]
},
...
```

Finally, we'll just add the method that gets called when the 'Add Todo' button is clicked.

```javascript
  ...
  methods: {
    ...
    addTodo(day) {
      this.editId = ++this.incId;
      this.todos.push({
        id: this.editId,
        description: 'New todo',
        isComplete: false,
        dates: day.date,
      });
    },
  }
```
<ClientOnly>
  <guide-attributes-popover-slots
    show-header
    show-add-todo>
  </guide-attributes-popover-slots>
</ClientOnly>

Awesome! We are finished! :tada: :tada: :tada:

### Components

The third option for configuring popovers is through the use of custom components. This is much like the `slot` option, except instead of using a slot with our custom content, we use a dedicated component (often a Single File Component). The key difference is in the way we access the `attribute`, `customData` and `day` objects.

To access these objects, all we need to do is declare them as props on our custom component, and they will get passed in automatically by `v-date-picker` at the appropriate time. Perhaps the best way to understand this is to see how `v-date-picker` implements its native popover component for date selections.

```html
<v-date-picker
  mode='range'
  :select-attribute='selectAttribute'
  v-model='range'
  show-caps
  is-inline>
</v-date-picker>
```

```javascript
export default {
  data() {
    return {
      range: {
        start: new Date(2018, 0, 8),
        end: new Date(2018, 0, 12),
      },
      selectAttribute: {
        popover: ({ onEnd }) => ({
          visibility: onEnd ? 'visible' : 'hover',
        })
      }
    }
  }
}
```

<ClientOnly>
  <guide-attributes-popover-components>
  </guide-attributes-popover-components>
</ClientOnly>

::: tip
This example will walk through how `v-date-picker` implements the native popover component. Replace any reference to `DatePickerDayPopover` with your own component.
:::

#### Step 1: Create the component

Create a new single file component (.vue file). Declare the following props if needed:

| Prop | Type | Description |
| ---- | ---- | ----------- |
| `attribute` | Object | The attribute object associated with the popover content row. |
| `customData` | Object | The custom data associated with the attribute above. Shortcut for `attribute.customData`. |
| `day` | Object | The [day object](/api/day-object.md) associated with the popover. |
| `format` | Function for formatting dates. Accepts `date: Date` and `format: String` arguments, respectively. |

Here are the template and script sections for the popover used with `v-date-picker`

```html
<div>
  <div class='date-label'>
    <div v-if='dateLabel'>
      {{ this.dateLabel }}
    </div>
    <div v-if='startDateLabel'>
      {{ this.startDateLabel }}
    </div>
    <div v-if='endDateLabel'>
      {{ this.endDateLabel }}
    </div>
  </div>
  <div
    v-if='isRange'
    class='days-nights'>
    <span class='days'>
      <svg-icon
        name='sun'
        class='vc-sun-o'>
      </svg-icon>
      {{ days }}
    </span>
    <span class='nights'>
      <svg-icon
        name='moon'
        class='vc-moon-o'>
      </svg-icon>
      {{ nights }}
    </span>
  </div>
</div>
```

```javascript
import SvgIcon from './SvgIcon';

export default {
  components: {
    SvgIcon,
  },
  props: {
    attribute: Object,
    dayFormat: String,
    format: Function,
  },
  computed: {
    date() {
      return this.attribute.targetDate;
    },
    isDate() {
      return this.date.isDate;
    },
    isRange() {
      return this.date.isRange;
    },
    days() {
      return this.date.daySpan + 1;
    },
    nights() {
      return this.date.daySpan;
    },
    dateLabel() {
      if (!this.date || !this.date.date) return '';
      return this.getDateString(this.date.date);
    },
    startDateLabel() {
      if (!this.date || !this.date.start) return '';
      return this.getDateString(this.date.start);
    },
    endDateLabel() {
      if (!this.date || !this.date.end) return '';
      return this.getDateString(this.date.end);
    },
  },
  methods: {
    getDateString(date) {
      return this.format(date, this.format);
    },
  },
};
```

From the attribute, we can extract information about the date it is associated with through its `targetDate` property. The `targetDate` is a [`DateInfo`](data.md#dateinfo--attributes-lifecycle) object wrapper that contains general information about the the date associated with the attribute. This includes information such as the start date, end date, day and night length spans.

#### Step 2: Import the component

Simply import the component into the file that is serving as the parent or host for the `v-calendar` or `v-date-picker` child components.

```javascript
import DatePickerDayPopover from './DatePickerDayPopover'; // .vue file
```

#### Step 3: Assign the component

Finally, when configuring the attribute (`select-attribute` and `drag-attribute` in this case), we assign the component to the popover's `component` property. Most often, if you are using your own component to display the popover content, it would be best to hide the default attribute indicator by setting `hideIndicator` to `true`.

```javascript
// ...configuring attribute
attribute: {
  // Configure the popover
  popover: {
    component: DatePickerDayPopover,
    hideIndicator: true // Don't want to show the indicator
  },
  // ...other attribute properties
}
```