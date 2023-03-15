---
title: 'Attributes'
---

# Attributes

Attributes are visual decorators that can be applied to specific calendar dates.

<Example centered>
  <AttributesIntro />
</Example>

Attributes are defined as an array of objects (each object is a separate attribute).

A single attribute may be displayed for single dates, date ranges and even complex date patterns. Some examples of complex patterns include:
* Every other Friday
* 15th of every month
* Last Friday of every other month.

Here is the basic structure of attributes:

```html
<VCalendar :attributes='attributes' />
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
        content: 'red',   // Boolean, String, Object
        highlight: true,  // Boolean, String, Object
        dot: true,        // Boolean, String, Object
        bar: true,        // Boolean, String, Object
        popover: { ... }, // Only objects allowed
        // Your custom data object for later access, if needed
        customData: { ... },
        // We also need some dates to know where to display the attribute
        // We use a single date here, but it could also be an array of dates,
        //  a date range or a complex date pattern.
        dates: new Date(),
        // Think of `order` like `z-index`
        order: 0
      }
    ];
  }
}
```

### Using `customData`

The `customData` property is used to link your own custom data object to the attribute. This is useful when handling events or providing custom slot content. For example, if a user clicks on a calendar day that is displaying the attribute, you might want to have some data associated with that attribute.

### Using `order`

By default, attributes are ordered to display the most information possible. For example, when attributes with highlighted regions overlap, single date regions appear above date range regions, and date ranges with a later start date appear above those with an earlier start date. 

If you would like to force an attribute to display above (or before) all others and override these rules, assign an order value greater than 0.

## Quick Guide

Let's start by displaying a simple **highlight** on today's date.

<Example centered>
  <AttributesHighlight />
</Example>

```vue
<template>
  <VCalendar :attributes='attrs' />
</template>

<script setup>
import { ref } from 'vue';

const attrs = ref([
  {
    key: 'today',
    highlight: true,
    dates: new Date(),
  },
]);
</script>
```

For the simple example above, we used the following properties to build the attribute:

| Property | Description |
| --- | --- |
| **`key`** | Uniquely identifies the attribute. This will come in handy later. |
| **`highlight`** | Config for the highlighted region displayed on each date. |
| **`dates`** | Dates used to display the attribute. |

<BaseAlert title="Attribute defaults">

  When simply assigning `true` to the highlight config (or any other attribute except popovers), the currently active color is used to display it. In this example, the `color` prop is not specified, so the default `color` (`"blue"`) and `fillMode` (`"solid"`) are used.
</BaseAlert>

Here is how the default dot config would appear.

<Example centered>
  <AttributesDot />
</Example>

```vue
<script setup>
import { ref } from 'vue';

const attrs = ref([
  {
    key: 'today',
    dot: true,
    dates: new Date(),
  },
]);
</script>
```

## Colors

Attributes inherit the default color from the `Calendar.color` prop (which is blue by default).

However, all attributes except popovers may be assigned directly to a color.

<Example centered>
  <AttributesHighlightColor />
</Example>

```vue
<script setup>
import { ref } from 'vue';

const attrs = ref([
  {
    key: 'today',
    highlight: 'red',
    dates: new Date(),
  },
]);
</script>
```

Additionally, when an object is used to configure an attribute, the `color` property may be assigned as part of that configuration.

Click to learn more about the custom properties for [content](#content), [highlights](#highlights), [dots](#dots), [bars](#bars) and [popovers](#popovers).

## Highlights

Highlights may be assigned a boolean, string or object value.

```js
// Uses the active color (default blue)
highlight: true   

// Uses the red color
highlight: 'red'

// Configuration object
highlight: {
  color: 'orange',
  fillMode: 'light',
}
```

When using an object value, these are the properties you may use for further highlight customization:

| Property | Type | Description |
| --- | --- | --- |
| `color` | String | Color. |
| `fillMode` | String | Color fill option: `solid` (default), `light`, `outline`. |
| `class` | String | Class to apply to the highlight background element. |
| `style` | Object | Style to apply to the highlight background element. |
| `contentClass` | String | Class to apply to the highlight content element. |
| `contentStyle` | Object | Style to apply to the highlight content element. |

Here is an example using each of the three fill mode types (`solid`, `light` and `outline`, respectively).

<Example centered>
  <AttributesHighlightCustom />
</Example>

```vue
<template>
  <VCalendar :attributes="attributes" />
</template>

<script setup>
import { ref } from 'vue';

const date = new Date();
const year = date.getFullYear();
const month = date.getMonth();
const attributes = ref([
  {
    key: 'today',
    highlight: {
      color: 'purple',
      fillMode: 'solid',
      contentClass: 'italic',
    },
    dates: new Date(year, month, 12),
  },
  {
    highlight: {
      color: 'purple',
      fillMode: 'light',
    },
    dates: new Date(year, month, 13),
  },
  {
    highlight: {
      color: 'purple',
      fillMode: 'outline',
    },
    dates: new Date(year, month, 14),
  },
]);
</script>
```

## Content

The day content (number label) may be configured with a boolean, string or object value.

```js
// Uses the active color (default blue)
content: true   

// Uses the red color
content: 'red'

// Configuration object
content: {
  style: {
    color: 'brown',
  }
}
```

When using an object value, these are the properties you may use for further content customization:

| Property | Type | Description |
| --- | --- | --- |
| `color` | String | Color. |
| `class` | String | Class to apply to the content element. |
| `style` | Object | Style to apply to the content element. |

<Example centered>
  <AttributesContent />
</Example>

```vue
<template>
  <VCalendar
    :initial-page="{ month: 1, year: 2018 }"
    :attributes="attributes"
  />
</template>

<script setup>
import { ref } from 'vue';

const attributes = ref([
  {
    // Boolean
    content: true,
    dates: [
      new Date(2018, 0, 1),
      new Date(2018, 0, 10),
      new Date(2018, 0, 22),
    ],
  },
  {
    // String
    content: 'red',
    dates: [
      new Date(2018, 0, 4),
      new Date(2018, 0, 10),
      new Date(2018, 0, 15),
    ],
  },
  {
    // Object
    content: {
      color: 'purple',
      style: {
        fontStyle: 'italic',
      },
    },
    dates: [
      new Date(2018, 0, 12),
      new Date(2018, 0, 26),
      new Date(2018, 0, 15),
    ],
  },
]);
</script>
```

## Dots

Dots may be assigned a boolean, string or object value.

```js
// Uses the active color (default blue)
dot: true   

// Uses the red color
dot: 'red'

// Configuration object
dot: {
  style: {
    backgroundColor: 'brown',
  }
}
```

When using an object value, these are the properties you may use for further dot customization:

| Property | Type | Description |
| --- | --- | --- |
| `color` | String | Color. |
| `class` | String | Class to apply to the dot element. |
| `style` | Object | Style to apply to the dot element. |

<Example centered>
  <AttributesDots />
</Example>

```vue
<template>
  <VCalendar
    :initial-page="{ month: 1, year: 2018 }"
    :attributes="attributes"
  />
</template>

<script setup>
import { ref } from 'vue';

const attributes = ref([
  {
    // Boolean
    dot: true,
    dates: [
      new Date(2018, 0, 1),
      new Date(2018, 0, 10),
      new Date(2018, 0, 22),
    ],
  },
  {
    // String
    dot: 'red',
    dates: [
      new Date(2018, 0, 4),
      new Date(2018, 0, 10),
      new Date(2018, 0, 15),
    ],
  },
  {
    // Object
    dot: {
      style: {
        backgroundColor: 'brown',
      },
    },
    dates: [
      new Date(2018, 0, 12),
      new Date(2018, 0, 26),
      new Date(2018, 0, 15),
    ],
  },
]);
</script>
```

## Bars

Bars may be assigned a boolean, string or object value. When more than one bar is dislayed per calendar day, they are equally spaced amongst each other. Thus, it might be a good idea to limit displaying up to 2 to 3 bars per day cell, as legibility can suffer.

```js
// Uses the active color (default blue)
bar: true   

// Uses the red color
bar: 'red'

// Configuration object
bar: {
  style: {
    backgroundColor: 'brown',
  }
}
```

These are the additional configuration options you may use for further bar customization:

| Property | Type | Description |
| --- | --- | --- |
| `color` | String | Color. |
| `class` | String | Class to apply to the bar element. |
| `style` | Object | Style to apply to the bar element. |

<Example centered>
  <AttributesBars />
</Example>

```vue
<template>
  <VCalendar
    :initial-page="{ month: 1, year: 2018 }"
    :attributes="attributes"
  />
</template>

<script setup>
import { ref } from 'vue';

const attributes = ref([
  {
    // Boolean
    bar: true,
    dates: [new Date(2018, 0, 1), new Date(2018, 0, 10), new Date(2018, 0, 22)],
  },
  {
    // String
    bar: 'red',
    dates: [new Date(2018, 0, 4), new Date(2018, 0, 10), new Date(2018, 0, 15)],
  },
  {
    // Object
    bar: {
      style: {
        backgroundColor: 'brown',
      },
    },
    dates: [
      new Date(2018, 0, 12),
      new Date(2018, 0, 26),
      new Date(2018, 0, 15),
    ],
  },
]);
</script>
```

## Target Options

Each attribute type allows for targeting `start`, `base` and `end` sections with separate configurations.

For example, we could style the `fillMode` for the highlight end caps separately from the base section.

<Example centered>
  <AttributesHighlightRange />
</Example>

```vue
<template>
  <VCalendar
    :initial-page="{ month: 1, year: 2019 }"
    :attributes="attributes"
  />
</template>

<script setup>
import { ref } from 'vue';

const attributes = ref([
  {
    highlight: {
      start: { fillMode: 'outline' },
      base: { fillMode: 'light' },
      end: { fillMode: 'outline' },
    },
    dates: { start: new Date(2019, 0, 14), end: new Date(2019, 0, 18) },
  },
]);
</script>
```

## Popovers

There are 2 basic approaches to displaying popovers within attributes.

### 1. Labels

Labels are the basic tooltip-style popover, configured as simple strings. By default, these popovers display when the user hovers over the day content and are not interactive to the user.

<AttributesPopoverLabels />

```vue
<template>
  <VCalendar :attributes="attributes" />
</template>

<script setup>
import { ref, computed } from 'vue';

const todos = ref([
  {
    description: 'Take Noah to basketball practice.',
    isComplete: false,
    dates: { weekdays: 6 }, // Every Friday
    color: 'red',
  },
]);

const attributes = computed(() => [
  // Attributes for todos
  ...todos.value.map(todo => ({
    dates: todo.dates,
    dot: {
      color: todo.color,
      class: todo.isComplete ? 'opacity-75' : '',
    },
    popover: {
      label: todo.description,
    },
  })),
]);
</script>
```

For this example, we simply assigned a string to the `popover.label` property. Now, the label displays in a popover whenever the user hovers over the day content (or taps on mobile).

If we want to force the user to click on the day content in order to display the popover, we can set the popover's `visibility` property to `"focus"` or `"click"`.

<AttributesPopoverLabels visibility="focus" />

```js
    ...
    popover: {
      label: todo.description,
      visibility: 'focus'
    }
    ...
```

<AttributesPopoverLabels visibility="click" />

```js
    ...
    popover: {
      label: todo.description,
      visibility: 'click'
    }
    ...
```

Also, you'll notice there is a small indicator next to the popover content row for the attribute. This is a simple indicator provided in order to help the user match up the popover content rows to the indicators in the calendar day cell.

If you would like to hide the indicator, just set the `hideIndicator` property to `true`;

<AttributesPopoverLabels visibility="hover" hide-indicators />

```js
    ...
    popover: {
      label: todo.description,
      visibility: 'hover',
      hideIndicator: true,
    }
    ...
```

### 2. Scoped Slot

For a more customized approach you can insert your own `"day-popover"` custom scoped slot within `VCalendar`.

<BaseAlert title="Scoped slots">

  If you are not familiar with the convention of using scoped slots in Vue.js, you can reference the [Vue docs](https://vuejs.org/guide/components/slots.html#scoped-slots).

</BaseAlert>

<Example centered>
  <AttributesPopoverSlot />
</Example>

```vue{3-7,31-33}
<template>
  <VCalendar :attributes="attributes">
    <template #day-popover>
      <div class="text-xs text-gray-700 dark:text-gray-300">
        Using my own content now
      </div>
    </template>
  </VCalendar>
</template>

<script setup>
import { ref, computed } from 'vue';

const todos = ref([
  {
    description: 'Take Noah to basketball practice.',
    isComplete: false,
    dates: { weekdays: 6 }, // Every Friday
    color: 'red',
  },
]);

const attributes = computed(() => [
  // Attributes for todos
  ...todos.value.map(todo => ({
    dates: todo.dates,
    dot: {
      color: todo.color,
      class: todo.isComplete ? 'opacity-75' : '',
    },
    // We need to at least pass a truthy value for the popover to appear
    // Pass an object to customize popover settings like visibility, placement, etc.
    popover: true,
    customData: todo,
  })),
]);
```

Now that you are providing your own popover, you need to display the attributes on your own. Fortunately, the following `slot-scope` props should provide you with everything you need to help you display content for your custom data.

| Property | Type | Description |
| -------- | ---- | ----------- |
| `day` | Object | The [day object](/calendar/api#calendarday) associated with the popover. |
| `dayTitle` | String | The formatted date title according to the `masks.dayPopover` prop |
| `attributes` | Array | All the attributes assigned for the associated day. Only attributes with 'truthy' values assigned to their `popover` key are passed in. |
| `format` | Function | Function for formatting dates. Accepts `date: Date` and `mask: String` arguments, respectively. |
| `masks` | Object | Set of format masks for the calendar. |
| `hide` | Function | Call this function to forcefully hide the popover. |

Let's walk through the process of customizing the previous example. First, let's add a header to display the date for the popover.

<Example centered>
  <AttributesPopoverSlot :step="2" />
</Example>

```html
<VCalendar :attributes="attributes">
  <template #day-popover="{ day, format, masks }">
    <div class="px-1">
      <div class="text-xs text-gray-700 dark:text-gray-300 font-semibold text-center">
        {{ format(day.date, masks.dayPopover) }}
      </div>
    </div>
  </template>
</VCalendar>
```

For the header, we use the `format` function to format the date for the current `day`, using the default `dayPopover` mask. Note: you could also just use your own custom mask.

Because this technique for displaying the header is common, you can extract the pre-formatted `dayTitle` property.

```html{5}
<VCalendar :attributes="attributes">
  <template #day-popover="{ day, dayTitle }">
    <div class="px-1">
      <div class="text-xs text-gray-700 dark:text-gray-300 font-semibold text-center">
        {{ dayTitle }}
      </div>
    </div>
  </template>
</VCalendar>
```

Now, we just need to display the attributes for the day as well. We can do so by extracting the `attributes` array from the slot-scope expression. We'll use a simple list to display the attribute data.

<Example centered>
  <AttributesPopoverSlot :step="3" />
</Example>

```html{7-11}
<VCalendar :attributes="attributes">
  <template #day-popover="{ dayTitle, attributes }">
    <div class="px-2">
      <div class="text-xs text-gray-700 dark:text-gray-300 font-semibold text-center">
        {{ dayTitle }}
      </div>
        <ul>
          <li
            v-for="{ key, customData } in attributes"
            :key="key"
            class="block text-xs text-gray-700 dark:text-gray-300 bg-red-100"
          >
            {{ customData.description }}
          </li>
        </ul>
    </div>
  </template>
</VCalendar>
```
