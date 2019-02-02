---
sidebarDepth: 2
---

# Date Picker

[Click here to reference the API for `v-date-picker`.](/api/datepicker.md)

`v-date-picker` is a powerful date picker delivered with `v-calendar`. It is simply a wrapper for `v-calendar` so it comes with a lot of flexibility out of the box. For example, it can accept all props supported by `v-calendar` and emits all of the same events.

Also, it uses [customizable](#customize-attributes) attributes under the hood to represent date selections (uses a `highlight` and `contentStyle`, by default). For example, you could change the date selection to dots instead of a highlight if that makes more sense for your application.

By default, it displays the calendar picker in a popover for an input element (which can be replaced with the default slot).

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

<ClientOnly>
  <guide-datepicker-intro-popover />
</ClientOnly>

Alternatively, the calendar can be displayed inline (not as a popover) by setting the`is-inline` prop.

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

<ClientOnly>
  <guide-datepicker-intro-inline />
</ClientOnly>

## Selection Modes

`v-date-picker` can be configured to operate in 3 different selection modes via the `mode` prop.
  * Single Date (`"single"`)
  * Multiple Dates (`"multiple"`)
  * Date Range (`"range"`)

### Single Date

The first and most common mode is single date selection. It uses a native Javascript `Date` object for its internal `value`, and the value can be cleared by setting the value to `null`. This is the default mode, so the `mode` prop declaration can be omitted if desired:

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

<ClientOnly>
  <guide-datepicker-single>
  </guide-datepicker-single>
</ClientOnly>

### Multiple Dates

The second mode is multiple date selection. It uses an array of `Date` objects for its internal `value` state. The selected value can be cleared by setting the value to `null` or an empty array `[]`. 

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

<ClientOnly>
  <guide-datepicker-multiple>
  </guide-datepicker-multiple>
</ClientOnly>

When used as a popover (`is-inline === false`), the user may enter dates in the input element as a list of comma separated date values. Each date is parsed with the built-in date parser using the specified `input` format(s). If the user clears out the input text, the value is set to `null`. [Read this to learn how to configure the input element.](#customize-input-element)

### Date Range

The third mode is date range selection. It uses an object consisting of optional start and end dates. The selected value can be cleared by setting the value to `null`. Using an empty object `{ }` for the value is equivalent to a range with infinite start and end dates.

```html
<v-date-picker
  mode='range'
  v-model='range'
  show-caps>
</v-date-picker>
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

<ClientOnly>
  <guide-datepicker-range>
  </guide-datepicker-range>
</ClientOnly>

You can see how the default popover for the range selection displays the currently selected (or dragged) start date and end date with indicators showing the length of the day and night spans. As expected, [this popover can also be configured to your own slot or component](#customize-selection-popover).

## Format & Parse Dates

Please reference the [formatting & parsing section of the README](/guide/#formatting-parsing) for steps to customizing the input element's formatting and parsing behavior.

## Set Min/Max Dates

Set min and max dates by assigning their respective `min-date` and `max-date` props. This will block date selection as well as calendar navigation for months outside of these specified dates.

```html
<v-date-picker
  v-model='date'
  :min-date='new Date(2018, 0, 1)'
  :max-date='new Date(2018, 0, 31)'
  is-inline>
</v-date-picker>
```

```javascript
export default {
  data() {
    return {
      date: null
    }
  }
}
```

<ClientOnly>
  <guide-datepicker-min-max>
  </guide-datepicker-min-max>
</ClientOnly>

## Disable Dates & Patterns

Sometimes you need more granularity than `min-date` and `max-date` provide. That is where `disabled-dates` and `available-dates` can be used.

The `disabled-dates` and `available-date` props are implemented using, you guessed it, an attribute. There is a `disabled-attribute` (which you [can customize](#customize-attributes)) that simply uses `disabled-dates` for its `dates` expression and `available-dates` for its `exclude-dates` expression. So, to understand how they work, you simply need to understand [the rules for configuring dates with attributes](attributes.md#using-dates).

Let's consider the previous example of setting a min and max dates. Suppose we would also like to disable the weekends. Here is how that would look.

```html
<v-date-picker
  v-model="date"
  mode="range"
  :min-date="new Date(2018, 0, 1)"
  :max-date="new Date(2018, 1, 28)"
  :disabled-dates="{ weekdays: [1, 7] }"
  />
```

```javascript
export default {
  data() {
    return {
      date: null
    }
  }
}
```

<ClientOnly>
  <guide-datepicker-disable-dates>
  </guide-datepicker-disable-dates>
</ClientOnly>

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
  2. Provide your own custom slot to use for the `input` element or omit it entirely.

### Set `input-props`

By default, `v-date-picker` leaves the `input` element as a bare element with no attributes applied. However, it is very easy to apply your own classes, styling, readonly behavior, placeholder and more by using the `input-props` prop. This is an object you can use to configure the element as if you configuring it directly.

Here, we assign some [Tailwind](https://tailwindcss.com/docs/what-is-tailwind/) classes, a placeholder and make the input readonly so the user has to select a date via the calendar.

```html
<v-date-picker
  v-model='myDate'
  :input-props='{
    class: "w-full shadow appearance-none border rounded py-2 px-3 text-grey-darker hover:border-blue",
    placeholder: "Please enter your birthday",
    readonly: true
  }'>
</v-date-picker>
```

<ClientOnly>
  <guide-datepicker-input-props>
  </guide-datepicker-input-props>
</ClientOnly>

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
      date: null
    }
  }
}
```

<ClientOnly>
  <guide-datepicker-disable-update>
  </guide-datepicker-disable-update>
</ClientOnly>

::: tip
The user can still commit changes via the input `change` event, which fires when the `enter` key is pressed or focus is removed from the input (consistent among browsers). However, this can cause erratic behavior if the input is embedded within a form element. [Read here for more details on embedding `v-date-picker` in form elements.](#embed-in-forms)
:::

### Set Input Debounce

Additionally, you can assign your own debounce, in milliseconds, via the `input-debounce` prop. The default duration is 1000ms, but here is an example of a making the input a little more responsive to text input.

```html
<v-date-picker
  v-model='date'
  :input-debounce='500'>
</v-date-picker>
```

```javascript
export default {
  data() {
    return {
      date: null
    }
  }
}
```

<ClientOnly>
  <guide-datepicker-input-debounce>
  </guide-datepicker-input-debounce>
</ClientOnly>

### Use Custom Slot

If you would like a more customized experience, you can use a custom slot to use as a trigger for the date picker popover element. For example, perhaps you would like to use a custom form component or include a button to clear the input value.

Here are the steps to utilize this approach.

  1. Provide a default slot for `v-date-picker`. Be sure to extract out the following props by using `slot-scope`:

| Prop | Description |
| ---- | ----------- |
| `inputProps` | Props that include the `value`, `placeholder`, `class` and `style` props needed for the input. |
| `inputEvents` | Events that are configured based on the props provided to `v-date-picker`, including `input`, `change` and `keyup`. Props like `update-on-input` and `input-debounce` are handled appropriately. |
| `updateValue` | Manual function that updates the value at the time of your choosing. It should be called only if `inputEvents` does not handle your needs (for example, if something other than an `input` element is used). |
  2. Set `v-bind='inputProps'` and `v-on='inputEvents'` to your input.
  3. Steps 1 & 2 should be sufficient for your input. However, if you need to manually set the value, such as with a button or other input method, call `updateValue(*newValue*, *options*)` to manually update and validate a string or data value, along with some additional options for how `v-date-picker` should react to your new value.

| Property | Description | Default Value |
| -------- | ----------- | ------------- |
| `formatInput` | If new value is valid, date picker should reformat the `inputValue` (based on `formats.input`). | `true` |
| `hidePopover` | If new value is valid, date picker should hide popover. | `!popoverKeepVisibleOnInput` |
| `debounce` | If new value is valid, debounce rate for which the value is assigned, in milliseconds. If missing, updates occur immediately. | `undefined` |

  ::: tip
  Passed values are validated against `disabled-dates`, `available-dates`, `min-date` and `max-date` props.
  :::

  Here is an example using custom input with a validation message and **Clear** button to clear out the date.

```html
<template>
  <div
    class='w-full max-w-sm'>
    <form
      class='bg-white shadow-md rounded px-8 pt-6 pb-8'
      @submit.prevent>
      <label
        class='block text-grey-darker text-sm font-bold mb-2'
        for='date'>
        Select Date Range
      </label>
      <div
        class='flex w-full'>
        <v-date-picker
          class='flex-grow'
          mode='range'
          v-model='date'
          show-caps>
          <div
            slot-scope='{ inputProps, inputEvents }'>
            <input
              id='date'
              class='shadow appearance-none border rounded-l w-full py-2 px-3 text-grey-darker'
              :class='{ "border-red": errorMessage }'
              v-bind='inputProps'
              v-on='inputEvents'>
          </div>
        </v-date-picker>
        <button
          type='button'
          class='bg-blue hover:bg-blue-dark text-white font-bold py-2 px-4 rounded-r '
          @click='date = null'>
          Clear
        </button>
      </div>
      <p
        class='text-red text-xs italic mt-1'
        v-if='errorMessage'>
        {{ errorMessage }}
      </p>
      <p
        class='text-green text-xs font-bold mt-1'
        v-else>
        We got it. Thanks!
      </p>
    </form>
  </div>
</template>
```

```javascript
export default {
  data() {
    return {
      date: null
    }
  },
  computed: {
    errorMessage() {
      if (!this.date) return 'Date is required.'
      return ''
    }
  }
}
```

<ClientOnly>
  <guide-readme-dp-custom-slot>
  </guide-readme-dp-custom-slot>
</ClientOnly>

## Customize Attributes

`v-date-picker` uses the following properties to properly display and validate date selections:

| Attribute | Description |
| --------- | ----------- |
| `tint-color` | Color of the selected attribute and drag attribute (with `opacity: 0.5` for drag). Overridden by `select-attribute` and `drag-attribute` if specified. |
| `select-attribute` | Attribute used to represent the selected value. |
| `drag-attribute` | Attribute used to represent the dragged value. Valid only when `mode === "range"`. |
| `disabled-attribute` | Attribute used to represent disabled days. |

The `tint-color` prop is a convenience prop for just changing the select and drag colors without having to worry about configuring the `select-attribute` and `drag-attribute` props themselves. The `select-attribute` and `drag-attribute` props, however, override `tint-color` as they are used for more detailed configuration of the attributes.

To customize these attributes, we just need to provide our own custom attributes objects. Any attributes we provide will replace the default ones.

::: tip
Attribute keys are automatically assigned for attributes (`"drag-select"` for the `select-attribute` and `drag-attribute`, `"disabled"` for `disabled-attribute`). The `disabled-attribute` is also assigned an `order` of `100`, so it can take precedence over the others.
:::

For example, say we want to use a `dot` instead of a `highlight` to denote the selected date. All we would need to do is pass a new `select-attribute`:


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
        dot: {
          backgroundColor: 'red'
        }
      }
    }
  }
}
```

<ClientOnly>
  <guide-datepicker-select-attribute>
  </guide-datepicker-select-attribute>
</ClientOnly>

Or if we want disabled dates to display a line through the days...

```html
<v-date-picker
  mode='range'
  v-model='date'
  :disabled-dates='{ weekdays: [1, 7] }'
  :disabled-attribute='disabledAttribute'
  is-inline>
</v-date-picker>
```

```javascript
export default {
  data() {
    return {
      date: null,
      disabledAttribute: {
        contentStyle: ({ isHovered }) => ({
          color: 'red',
          textDecoration: 'line-through',
          opacity: 0.5,
          // Hide background and disable cursor on hover
          ...(isHovered && {
            cursor: 'default',
            backgroundColor: 'transparent'
          })
        })
      }
    }
  }
}
```

<ClientOnly>
  <guide-datepicker-disable-attribute>
  </guide-datepicker-disable-attribute>
</ClientOnly>

## Customize Selection Popover

When the user makes a date selection, a default popover is shown that
  * Displays the selected day when `mode === "single" || mode === "multiple"`
  * Displays the start date, end date, day and night spans when `mode === "range"`

### Popover for Single & Multiple Date Attributes
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
        popover: {
          visibility: 'visible'
        }
      }
    }
  }
}
```

<ClientOnly>
  <guide-datepicker-single-popover>
  </guide-datepicker-single-popover>
</ClientOnly>

### Popover for Date Range Attribute

```html
<v-date-picker
  mode='range'
  :select-attribute='selectAttribute'
  v-model='range'
  is-inline>
</v-date-picker>
```

```javascript
export default {
  data() {
    return {
      range: {
        start: new Date(2018, 0, 1),
        end: new Date(2018, 0, 6)
      },
      selectAttribute: {
        popover: ({ onEnd }) => ({
          visibility: onEnd ? 'visible' : 'hover'
        })
      }
    }
  }
}
```

<ClientOnly>
  <guide-datepicker-range-popover>
  </guide-datepicker-range-popover>
</ClientOnly>

If you would like to provide your own popover, you can do so by configuring the `popover` object for the `select-attribute` and/or the `drag-attribute` to display your own custom slot or component.

In fact, you can see how `v-date-picker` configures its own popover component by [referencing the steps for using a custom component as a popover content row](attributes.md#components).

<!-- ## Embed in Forms -->