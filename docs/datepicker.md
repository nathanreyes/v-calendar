---
title: 'Date Picker'
sidebarDepth: 2
---

# Date Picker

`v-date-picker` is a powerful date picker delivered with `v-calendar`. It is simply a wrapper for `v-calendar` so it comes with a lot of flexibility out of the box. For example, it accepts all props supported by `v-calendar` and emits all of the same events.

Also, it uses [customizable](#customize-attributes) attributes under the hood to represent selected dates. For example, you could change the date selection from a highlight to dots if that makes more sense for your application.

## Display Options

### Popover

By default, `v-date-picker` displays a calendar picker within a popover for an input element. This is the default display option.

<guide-datepicker-intro-popover />

```html
<v-date-picker
  v-model="date"
  />
```

```js
export default {
  data() {
    return {
      date: new Date(),
    };
  },
};
```

### Custom Slot

Using the default slot, you can replace the input element with your own trigger element.

<guide-datepicker-custom-slot />

```html
<v-date-picker
  v-model="date"
  :popover="{ placement: 'bottom', visibility: 'click' }">
  <button class="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded focus:outline-none">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      class="w-4 h-4 fill-current">
      <path d="M1 4c0-1.1.9-2 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V4zm2 2v12h14V6H3zm2-6h2v2H5V0zm8 0h2v2h-2V0zM5 9h2v2H5V9zm0 4h2v2H5v-2zm4-4h2v2H9V9zm0 4h2v2H9v-2zm4-4h2v2h-2V9zm0 4h2v2h-2v-2z" />
    </svg>
  </button>
</v-date-picker>
```

### Inline

Alternatively, the calendar can be displayed inline (not as a popover) by setting the`is-inline` prop.

<guide-datepicker-intro-inline />

```html
<v-date-picker
  v-model="dates"
  mode="multiple"
  is-inline
  />
```

```js
export default {
  data() {
    return {
      dates: [new Date(2018, 0, 9), new Date(2018, 0, 25)],
    };
  },
};
```

## Selection Modes

`v-date-picker` can be configured to operate in 3 different selection modes via the `mode` prop.
  * Single Date (`"single"`)
  * Multiple Dates (`"multiple"`)
  * Date Range (`"range"`)

### Single Date

The first mode is single date selection. It uses a native Javascript `Date` object for its internal `value`, and the value can be cleared by setting the value to `null`. This is the default mode, so the `mode` prop declaration can be omitted if desired:

<guide-datepicker-single />

```html
<v-date-picker
  v-model='date'
  />
```

```javascript
export default {
  data() {
    return {
      date: new Date(2018, 0, 25) // Jan 25th, 2018
    }
  }
}
```

### Multiple Dates

The second mode is multiple date selection. It uses an array of `Date` objects for its internal `value` state. The selected value can be cleared by setting the value to `null` or an empty array `[]`.

<guide-datepicker-multiple />

```html
<v-date-picker
  mode='multiple'
  v-model='dates'
  />
```

```javascript
export default {
  data() {
    return {
      dates: [
        new Date(2018, 0, 1),  // Jan 1st, 2018
        new Date(2018, 0, 15), // Jan 15th, 2018
        new Date(2018, 0, 29)  // Jan 29th, 2018
      ]
    }
  }
}
```

When used as a popover (`is-inline === false`), the user may enter dates in the input element as a list of comma separated date values. Each date is parsed with the built-in date parser using the specified `input` mask(s). If the user clears out the input text, the value is set to `null`. [Read this to learn how to configure the input element.](#customize-input-element)

### Date Range

The third mode is date range selection with start and end dates. The selected value can be cleared by setting the value to `null`. Using an empty object `{ }` for the value is equivalent to a range with infinite start and end dates.

<guide-datepicker-range />

```html
<v-date-picker
  mode='range'
  v-model='range'
  />
```

```javascript
export default {
  data() {
    return {
      range: {
        start: new Date(2018, 0, 16), // Jan 16th, 2018
        end: new Date(2018, 0, 19)    // Jan 19th, 2018
      }
    }
  }
}
```

## Format & Parse Dates

Please reference the [formatting & parsing section](/guide/#formatting-parsing) for steps to customizing the input element's formatting and parsing behavior.

## Disable Dates

Refer to the [disabling dates section](./README.md#disabling-dates).

## Require Selected Date

There are 3 ways to clear a selected date (`value = null`).
  1. Assign `null` to `value` prop or to local state variable that is bound to using `v-model`
  2. User toggles selected dates by clicking them on the calendar (only valid when `mode` is `"single"` or `"multiple"`)
  3. User clears the input element text and commits the change by pressing the `enter` key or changing focus (`blur` event)

You can prevent methods 2 and 3 by setting the `is-required` prop to `true`.

::: warning
This effectively prevents the *user* from clearing the value. The developer can still clear it via method 1.
:::

## Customize Input Element

::: tip
The following applies for date pickers in popover mode (`is-inline === false`)
:::

There are 2 ways to customize the input element for `v-date-picker`
1. Apply props for styling and behavior to the built in `input` element.
2. Replace the `input` element entirely with your own custom element.

### Set `input-props`

By default, `v-date-picker` leaves the `input` element as a bare element with no attributes applied. However, it is very easy to apply your own classes, styling, readonly behavior, placeholder and more by using the `input-props` prop. This is an object you can use to configure the element as if you configuring it directly.

Here, we assign some [Tailwind](https://tailwindcss.com/docs/what-is-tailwind/) classes, a placeholder and make the input readonly so the user has to select a date via the calendar.

<guide-datepicker-input-props />

```html
<v-date-picker
  v-model='myDate'
  :input-props='{
    class: "w-full shadow appearance-none border rounded py-2 px-3 text-gray-700 hover:border-blue-5",
    placeholder: "Please enter your birthday",
    readonly: true
  }'
  />
```

### Use Custom Slot

If you would like a more customized experience, you can use a custom slot to use as a trigger for the date picker popover element. For example, perhaps you would like to use a custom form input or something completely different.

Here are the steps to utilize this approach.

  1. Provide a default slot for `v-date-picker`. Be sure to extract out the following props by using `slot-scope`:

| Prop | Type | Description |
| ---- | ---- | ----------- |
| `inputProps` | Object | Props that include the `value`, `placeholder`, `class` and `style` props needed for the input. |
| `inputEvents` | Object | Events that are configured based on the props provided to `v-date-picker`, including `input`, `change` and `keyup`. Props like `update-on-input` and `input-debounce` are handled appropriately. |
| `isDragging` | Boolean | Flag that is set when the user is actively dragging for a new range selection. |
| `updateValue` | Function | Call to update the value at the time of your choosing. |
| `hidePopover` | Function | Call to manually hide the popover. |

:::tip
Call `updateValue()` only if `inputEvents` does not handle your needs (for example, if something other than an `input` element is used).
:::

  2. Set `v-bind='inputProps'` and `v-on='inputEvents'` to your input, if needed.
  3. Steps 1 & 2 should be sufficient for your input. However, if you need to manually set the value, such as with a button or other input method, call `updateValue(*newValue*, *options*)` to manually update and validate a string or data value, along with some additional options for how `v-date-picker` should react to your new value.

| Property | Description | Default Value |
| -------- | ----------- | ------------- |
| `formatInput` | If new value is valid, date picker should reformat the `inputValue` (based on `masks.input`). | `true` |
| `hidePopover` | If new value is valid, date picker should hide popover. | `false` |
| `debounce` | If new value is valid, debounce rate for which the value is assigned, in milliseconds. If missing, updates occur immediately. | `undefined` |
| `adjustPageRange` | If new value is valid, adjust the `from-page` in order to properly display the new assigned value. | `undefined` |

::: tip
Values passed to `updateValue()` are validated against `disabled-dates`, `available-dates`, `min-date` and `max-date` props.
:::

Here is an example using custom input with a validation message and **Clear** button to clear out the date.

<guide-readme-dp-custom-slot />

```html
<div class="w-full max-w-sm">
  <form
    class="bg-white shadow-md rounded px-8 pt-6 pb-8"
    @submit.prevent>
    <label
      class="block text-gray-700 text-sm font-bold mb-2"
      for="date">
      Select Date Range
    </label>
    <div class="flex w-full">
      <v-date-picker
        mode="range"
        v-model="date"
        class="flex-grow">
        <!--Custom Input Slot-->
        <input
          id="date"
          slot-scope="{ inputProps, inputEvents, isDragging }"
          :class="[`shadow appearance-none border rounded-l w-full py-2 px-3 ${ isDragging ? 'text-gray-400' : 'text-gray-700' }`, { 'border-red-600': errorMessage }]"
          v-bind="inputProps"
          v-on="inputEvents">
      </v-date-picker>
      <!--Clear Button-->
      <button
        type="button"
        class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-r"
        @click="date = null">
        Clear
        </button>
    </div>
    <p class="text-red-600 text-xs italic mt-1" v-if="errorMessage">
      {{ errorMessage }}
    </p>
    <p class="text-blue-500 text-xs font-bold mt-1" v-else>
      We got it. Thanks!
    </p>
  </form>
</div>
```

```js
export default {
  data() {
    return {
      date: null,
    };
  },
  computed: {
    errorMessage() {
      if (!this.date) return 'Date is required.';
      return '';
    },
  },
};
```

### Disable Update On Input

By default, the date picker's value will update as the user types into the input element with a debounce of `1000` milliseconds.

If you would like to prevent this update behavior, set the `update-on-input` prop to false.

```html
<v-date-picker
  v-model='date'
  :update-on-input='false'>
</v-date-picker>
```

```javascript
export default {
  data() {
    return {
      date: new Date()
    }
  }
}
```

<guide-datepicker-disable-update />

::: tip
The user can still commit changes via the input `change` event, which fires when the `enter` key is pressed or focus is removed from the input (consistent among browsers). However, this can cause erratic behavior if the input is embedded within a form element. [Read here for more details on embedding `v-date-picker` in form elements.](#embed-in-forms)
:::

### Set Input Debounce

Additionally, you can assign your own debounce, in milliseconds, via the `input-debounce` prop. The default duration is 1000ms, but here is an example of a making the input a little more responsive to text input.

```html
<v-date-picker
  v-model='date'
  :input-debounce='500'
  />
```

```javascript
export default {
  data() {
    return {
      date: new Date(),
    }
  }
}
```

<guide-datepicker-input-debounce />

## Customize Attributes

`v-date-picker` uses the following props to display date selections:

| Attribute | Description |
| --------- | ----------- |
| `select-attribute` | Attribute used to represent the selected value. |
| `drag-attribute` | Attribute used to represent the dragged value. Valid only when `mode === "range"`. |

To customize these attributes, we just need to provide our own custom attributes objects. Any attributes we provide will replace the default ones.

::: tip
Both attributes are assigned a key of `"select-drag"`.
:::

For example, say we want to use a `dot` instead of a `highlight` to denote the selected date. All we would need to do is pass a new `select-attribute`:

<guide-datepicker-select-attribute />

```html
<v-date-picker
  v-model='date'
  :select-attribute='selectAttribute'
  is-inline>
</v-date-picker>
```

```javascript
export default {
  data() {
    return {
      date: new Date(),
      selectAttribute: {
        dot: true
      }
    }
  }
}
```

### Selection Popover

Finally, let's look at an example of adding a simple popover to the dragged and selected date ranges. Note that here we include the `day-popover` slot, and make sure to assign a truthy value to the `popover` property of the attribute.

We'll first try to display the dragged range, then fall back to the selected range.

<guide-datepicker-range-popover />

```html
<v-date-picker
  mode="range"
  v-model="range"
  :select-attribute="selectDragAttribute"
  :drag-attribute="selectDragAttribute"
  is-inline
  @drag="dragValue = $event"
>
  <div slot="day-popover" slot-scope="{ format}">
    {{ format(dragValue ? dragValue.start : range.start, 'MMM D') }}
    -
    {{ format(dragValue ? dragValue.end : range.end, 'MMM D') }}
  </div>
</v-date-picker>
```

```js
export default {
  data() {
    return {
      dragValue: null,
      range: {
        start: new Date(2018, 0, 8),
        end: new Date(2018, 0, 12),
      },
    };
  },
  computed: {
    selectDragAttribute() {
      return {
        popover: {
          visibility: 'hover',
          isInteractive: false, // Defaults to true when using slot
        },
      };
    },
  },
};
```

<!-- ## Embed in Forms -->