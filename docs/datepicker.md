---
title: 'Date & Time Picker :tada:'
sidebarDepth: 2
---

# Date Picker

:::warning
As of `v1.1.0`, the following **breaking** changes have been made to `v-date-picker`

- `mode` prop now accepts the following `String` values
  - `"date"`: Date selection
  - `"dateTime"`: Date & time selection
  - `"time"`: Time selection
- `is-range` should be used for date range values, replacing the use of `mode = "range"` for previous versions.
- Multiple date selection is deprecated for alternative patterns
  :::

`v-date-picker` is a powerful date picker delivered with `v-calendar`. It is simply a wrapper for `v-calendar` so it comes with a lot of flexibility out of the box. For example, it accepts all props supported by `v-calendar` and emits all of the same events.

Also, it uses [customizable](#customize-attributes) attributes under the hood to represent selected dates. For example, you could change the date selection from a highlight to dots if that makes more sense for your application.

## Inline

A calendar picker can be displayed inline by setting the `is-inline` prop.

<guide-datepicker-intro-inline />

```html
<v-date-picker v-model="date" is-inline />
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

## Popover

:::warning
As of `v1.1.0`, `v-date-picker` no longer provides an `input` element as the default slot. This slot **must** be provided by the developer. Additionally, the `inputProps` prop as been deprecated in favor of simply binding the input value to the `inputValue` slot prop.
:::

To display the picker as a popover, provide your own content as the default slot. Most often this will be an `input` element.

## Input

To allow for user date text entry, provide a custom `input` element as the default slot. `v-date-picker` provides formatting, parsing and event handling out of the box via the following slot props:

- `inputValue`: The is the value you should bind to your input. This value will update as new dates are assigned and validated by the component.
- `inputEvents`: These events include handlers for events that ultimately assign new dates and manage the appearance of the popover (as specified via the `popover` prop).

<guide-datepicker-intro-popover />

```html
<v-date-picker v-model="date">
  <template v-slot="{ inputValue, inputEvents }">
    <input
      class="bg-white border px-2 py-1 rounded"
      :value="inputValue"
      v-on="inputEvents"
    />
  </template>
</v-date-picker>
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

### Debounce

Use the `input-debounce` prop (in milliseconds) to set a custom debounce duration. This example makes the input a little more responsive to text input by using a debounce of `500ms` rather than the default `1000ms`.

<guide-datepicker-input-debounce />

```html
<v-date-picker v-model="date" :input-debounce="500">
  <template v-slot="{ inputValue, inputEvents }">
    <input
      class="bg-white border px-2 py-1 rounded"
      :value="inputValue"
      v-on="inputEvents"
    />
  </template>
</v-date-picker>
```

```javascript
export default {
  data() {
    return {
      date: new Date(),
    };
  },
};
```

### Disable Update On Input

To completely disable value updates as the user types, set the `update-on-input` prop to false. This will defer updates until the input's `change` event occurs.

<guide-datepicker-disable-update />

```html
<v-date-picker v-model="date" :update-on-input="false">
  <template v-slot="{ inputValue, inputEvents }">
    <input
      class="bg-white border px-2 py-1 rounded"
      :value="inputValue"
      v-on="inputEvents"
    />
  </template>
</v-date-picker>
```

```javascript
export default {
  data() {
    return {
      date: new Date(),
    };
  },
};
```

### Format & Parse

By default, the localized format will be used to format and parse the input text.

Just like the `v-calendar` component, `v-date-picker` accepts an explicit `locale` prop. This might be preferred if you store your user's locale in a database or want to force all user's to a specific locale.

<guide-datepicker-input-format-parse />

```html
<v-date-picker v-model="date" :locale="locale">
  <template v-slot="{ inputValue, inputEvents }">
    <input
      class="bg-white border px-2 py-1 rounded"
      :value="inputValue"
      v-on="inputEvents"
    />
  </template>
</v-date-picker>
```

```js
data() {
  return {
    date: new Date(),
    locale: null,
  };
},
created() {
  // Fetch user's locale using custom API (eg. 'en-ZA')
  this.locale = await api.getUserLocale();
}
```

To use a custom mask that overrides the `locale`, assign the `masks.input` prop.

<guide-datepicker-input-mask />

```html
<v-date-picker v-model="date" :masks="masks">
  <template v-slot="{ inputValue, inputEvents }">
    <input
      class="bg-white border px-2 py-1 rounded"
      :value="inputValue"
      v-on="inputEvents"
    />
  </template>
</v-date-picker>
```

```js
data() {
  return {
    date: new Date(),
    masks: {
      input: 'YYYY-MM-DD',
    },
  };
},
```

Please reference the [formatting & parsing section](./i18n.md#formatting-parsing-dates) for a complete list of available mask tokens.

### Form Example

Here is a more complex example using a custom input with a validation message and **Clear** button to clear out the date.

<guide-readme-dp-custom-slot />

```html
<div class="w-full max-w-sm">
  <form class="bg-white shadow-md rounded px-8 pt-6 pb-8" @submit.prevent>
    <label class="block text-gray-700 text-sm font-bold mb-2" for="date"
      >Select Date</label
    >
    <div class="flex w-full">
      <v-date-picker v-model="date" class="flex-grow">
        <template v-slot="{ inputValue, inputEvents, isDragging }">
          <input
            id="date"
            class="bg-white w-full py-2 px-3 appearance-none border rounded-l focus:outline-none"
            :class="[
                  isDragging ? 'text-gray-400' : 'text-gray-700',
                  { 'border-red-600': errorMessage },
                ]"
            :value="inputValue"
            v-on="inputEvents"
          />
        </template>
      </v-date-picker>
      <button
        type="button"
        class="text-white font-bold py-2 px-4 rounded-r user-select-none focus:outline-none"
        :class="date ? 'bg-red-500' : 'bg-red-300'"
        :disabled="!date"
        @click="date = null"
      >
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

## Advanced Slots

Besides `input`s, other elements may be effectively used as the default slot.

In this example, we can extract the `togglePopover` slot function variable to toggle the popover when the button is clicked.

<guide-datepicker-custom-slot />

```html
<v-date-picker v-model="date">
  <template v-slot="{ togglePopover }">
    <button
      class="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded focus:outline-none"
      @click="togglePopover()"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        class="w-4 h-4 fill-current"
      >
        <path
          d="M1 4c0-1.1.9-2 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V4zm2 2v12h14V6H3zm2-6h2v2H5V0zm8 0h2v2h-2V0zM5 9h2v2H5V9zm0 4h2v2H5v-2zm4-4h2v2H9V9zm0 4h2v2H9v-2zm4-4h2v2h-2V9zm0 4h2v2h-2v-2z"
        />
      </svg>
    </button>
  </template>
</v-date-picker>
```

Here is a comprehensive list of the available slot props.

| Prop | Type | Description |
| --- | --- | --- |
| `inputValue` | Object | Input text value. |
| `inputEvents` | Object   | Events that are configured based on the props provided to `v-date-picker`, including `input`, `change` and `keyup`. Props like `update-on-input` and `input-debounce` are handled appropriately. |
| `isDragging` | Boolean  | Set when the user is dragging a new range selection. |
| `updateValue` | Function | Call to update the value at the time of your choosing. |
| `showPopover` | Function | Call to manually show the popover. |
| `hidePopover` | Function | Call to manually hide the popover. |
| `togglePopover` | Function | Call to show/hide the popover. |
| `getPopoverTriggerEvents` | Function | Call to get the bindable events for a given display mode. |

#### `updateValue()`

Call `updateValue(value, opts)` to manually update the date value with some side-effect options. All side-effects assume that the provided value is valid.

::: tip
Values passed to `updateValue()` are validated against `disabled-dates`, `available-dates`, `min-date` and `max-date` props.
:::

| Parameter | Type | Description | Default Value |
| --------- | ---- | ----------- | ------------- |
| `value` | `Date`, `String`, `Number` | New date value | `undefined` |
| `opts.formatInput` | `Boolean` | Reformat the `inputValue`. | `true` |
| `opts.hidePopover` | `Boolean` | Hide the popover. | `false` |
| `opts.debounce` | `Number` | Debounce rate (ms) for which the value is assigned. | `undefined` |
| `opts.adjustPageRange` | `Boolean` | Adjust the `from-page` in order to properly display the value. | `undefined` |

## Date Ranges

## Selection Modes :tada:

### Date

### Date & Time

### Time

## Model Binding

### Single Dates

`v-date-picker` can bind to single dates and date ranges using the `v-model` directive. Single date binding is the default configuration.

```html
<v-date-picker value="date" is-inline />
```

```js
data() {
  return {
    date: new Date(),
  }
}
```

### Date Ranges

To bind to date range values, set the `is-range` prop.

```html
<v-date-picker value="range" is-range is-inline />
```

```js
data() {
  return {
    range: {
      start: new Date(2020, 0, 1),
      end: new Date(2020, 0, 5)
    }
  }
}
```

### Strings :tada:

Previous to `v1.1.0`, binding was strictly limited to Javascript `Date` values.

Binding to a string is now available.

<!-- <guide-datepicker-format-parse-model /> -->

```html
<v-date-picker v-model="customer.birthday" />
```

```js
export default {
  props: {
    // Customer model with birthday in 'YYYY-MM-DD' format
    customer: Object,
  },
};
```

### Numbers

## Disable Dates

Refer to the [disabling dates section](./dates.md#disabling-dates).

## Require Selected Date

There are 3 ways to clear a selected date (`value = null`).

1. Assign `null` to `value` prop or to local state variable that is bound to using `v-model`
2. User toggles selected dates by clicking them on the calendar (only valid when `mode` is `"single"` or `"multiple"`)
3. User clears the input element text and commits the change by pressing the `enter` key or changing focus (`blur` event)

You can prevent methods 2 and 3 by setting the `is-required` prop to `true`.

::: warning
This effectively prevents the _user_ from clearing the value. The developer can still clear it via method 1.
:::

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
  v-model="date"
  :select-attribute="selectAttribute"
  is-inline
/>
```

```javascript
export default {
  data() {
    return {
      date: new Date(),
      selectAttribute: {
        dot: true,
      },
    };
  },
};
```

### Selection Popover

Finally, let's look at an example of adding a simple popover to the dragged and selected date ranges. Note that here we include the `day-popover` slot, and make sure to assign a truthy value to the `popover` property of the attribute.

We'll first try to display the dragged range, then fall back to the selected range.

<guide-datepicker-range-popover />

```html
<v-date-picker
  v-model="range"
  :select-attribute="selectDragAttribute"
  :drag-attribute="selectDragAttribute"
  is-inline
  is-range
  @drag="dragValue = $event"
>
  <template v-slot:day-popover="{ format }">
    <div>
      {{ format(dragValue ? dragValue.start : range.start, 'MMM D') }}
      -
      {{ format(dragValue ? dragValue.end : range.end, 'MMM D') }}
    </div>
  </template>
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
