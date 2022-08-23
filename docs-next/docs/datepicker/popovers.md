# Popovers

To display the picker as a popover, provide your own content as the default slot. Most often this will be an `input` element.

## Date Input

To allow for user date text entry, provide a custom `input` element as the default slot. `DatePicker` provides formatting, parsing and event handling out of the box via the following slot props:

- `inputValue`: The is the value you should bind to your input. This value will update as new dates are assigned and validated by the component.
- `inputEvents`: These events include handlers for events that ultimately assign new dates and manage the appearance of the popover (as specified via the `popover` prop).

<PopoverIntro />

```vue
<template>
  <DatePicker v-model="date">
    <template v-slot="{ inputValue, inputEvents }">
      <BaseInput :value="inputValue" v-on="inputEvents" />
    </template>
  </DatePicker>
</template>

<script setup>
import { ref } from 'vue';
const date = ref(new Date());
</script>
```

## Range Inputs

When binding to a date range and providing custom `input` elements, the `inputValue` and `inputEvents` are split into separate `start` and `end` sub-properties. 

<!-- <guide-datepicker-range-input /> -->

```html
<v-date-picker v-model="range" is-range>
  <template v-slot="{ inputValue, inputEvents }">
    <div class="flex justify-center items-center">
      <input
        :value="inputValue.start"
        v-on="inputEvents.start"
        class="border px-2 py-1 w-32 rounded focus:outline-none focus:border-indigo-300"
      />
      <svg
        class="w-4 h-4 mx-2"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M14 5l7 7m0 0l-7 7m7-7H3"
        />
      </svg>
      <input
        :value="inputValue.end"
        v-on="inputEvents.end"
        class="border px-2 py-1 w-32 rounded focus:outline-none focus:border-indigo-300"
      />
    </div>
  </template>
</v-date-picker>
```

```js
export default {
  data() {
    return {
      range: {
        start: new Date(2020, 9, 12),
        end: new Date(2020, 9, 16),
      },
    };
  },
};
```

### Debounce

Use the `input-debounce` prop (in milliseconds) to set a custom debounce duration. This example makes the input a little more responsive to text input by using a debounce of `500ms` rather than the default `1000ms`.

<!-- <guide-datepicker-input-debounce /> -->

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

<!-- <guide-datepicker-disable-update /> -->

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

<!-- <guide-datepicker-input-format-parse /> -->

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

<!-- <guide-datepicker-input-mask /> -->

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

<!-- <guide-readme-dp-custom-slot /> -->

```html
<div class="w-full max-w-sm">
  <form class="bg-white shadow-md rounded px-8 pt-6 pb-8" @submit.prevent>
    <label class="block text-gray-600 text-sm font-bold mb-2" for="date"
      >Select Date</label
    >
    <div class="flex w-full">
      <v-date-picker v-model="date" class="flex-grow">
        <template v-slot="{ inputValue, inputEvents }">
          <input
            id="date"
            class="bg-white text-gray-700 w-full py-2 px-3 appearance-none border rounded-l focus:outline-none"
            :class="{ 'border-red-600': errorMessage }"
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

### Advanced Slots

Besides `input`s, other elements may be effectively used as the default slot. When doing so, there are other slot variables that you may use to further customize date selection behavior.

:::tip
See the [date picker examples](/examples/datepickers.html) for more guidance on using these slot variables.
:::

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

## Disable Dates

Refer to the [disabling dates section](./dates.md#disabling-dates).

## Require Selected Date

Setting the `is-required` prop will prevent clearing the date value by deleting all text from the `input` element or re-selecting a picker date.

<!-- <guide-datepicker-is-required /> -->

```html
<v-date-picker v-model="date" is-required>
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