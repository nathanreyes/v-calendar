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
    <template #default="{ inputValue, inputEvents }">
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

<Example centered>
  <DateRangeInput />
</Example>

```vue
<template>
  <DatePicker v-model="range" is-range>
    <template #default="{ inputValue, inputEvents }">
      <div class="flex justify-center items-center">
        <BaseInput :value="inputValue.start" v-on="inputEvents.start" />
        <svg
          class="text-gray-400 dark:text-gray-500 w-4 h-4 mx-2"
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
        <BaseInput :value="inputValue.end" v-on="inputEvents.end" />
      </div>
    </template>
  </DatePicker>
</template>

<script setup>
import { ref } from 'vue';

const range = ref({
  start: new Date(2020, 9, 12),
  end: new Date(2020, 9, 16),
});
</script>
```

## Debounce

Use the `input-debounce` prop (in milliseconds) to set a custom debounce duration. This example makes the input a little more responsive to text input by using a debounce of `500ms` rather than the default `1000ms`.

<Example centered>
  <DateInputDebounce />
</Example>

```vue
<template>
  <DatePicker v-model="date" :input-debounce="500">
    <template #default="{ inputValue, inputEvents }">
      <BaseInput :value="inputValue" v-on="inputEvents" />
    </template>
  </DatePicker>
</template>

<script setup>
import { ref } from 'vue';
const date = ref(new Date());
</script>
```

## Disable Update On Input

To completely disable value updates as the user types, set the `update-on-input` prop to false. This will defer updates until the input's `change` event occurs.

<Example centered>
  <DateInputDisableUpdate />
</Example>

```vue
<template>
  <DatePicker v-model="date" :update-on-input="false">
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

## Input Format

### Locale

By default, the browser's detected locale will be used to format and parse the input text.

However, a `locale` prop can be provided to override this setting. This could be helpful if you store your user's locale in a database or want to force all user's to a specific locale.

<Example centered>
  <DateInputLocale />
</Example>

```vue
<template>
  <DatePicker v-model="date" :locale="locale">
    <template v-slot="{ inputValue, inputEvents }">
      <BaseInput :value="inputValue" v-on="inputEvents" />
    </template>
  </DatePicker>
</template>

<script setup>
import { ref } from 'vue';

const date = ref(new Date());
const locale = ref(null);

// Fetch user's locale using custom API (eg. 'en-ZA')
locale.value = await api.getUserLocale();
</script>
```

### Mask

Alternatively, if you wish to keep the locale, but just override the locale's input format, provide a custom mask via  the `masks.input` prop.

<Example centered>
  <DateInputMask />
</Example>

```vue
<template>
  <DatePicker v-model="date" :masks="masks">
    <template v-slot="{ inputValue, inputEvents }">
      <BaseInput :value="inputValue" v-on="inputEvents" />
    </template>
  </DatePicker>
</template>

<script setup>
import { ref } from 'vue';
const date = ref(new Date());
const masks = ref({
  input: 'YYYY-MM-DD',
});
</script>
```

Please reference the [formatting & parsing section](./i18n.md#formatting-parsing-dates) for a complete list of available mask tokens.

## Form Example

Here is a more complex example using a custom input with a validation message and **Clear** button to clear out the date.

<!-- <guide-readme-dp-custom-slot /> -->

```html
<div class="w-full max-w-sm">
  <form class="bg-white shadow-md rounded px-8 pt-6 pb-8" @submit.prevent>
    <label class="block text-gray-600 text-sm font-bold mb-2" for="date"
      >Select Date</label
    >
    <div class="flex w-full">
      <DatePicker v-model="date" class="flex-grow">
        <template v-slot="{ inputValue, inputEvents }">
          <input
            id="date"
            class="bg-white text-gray-700 w-full py-2 px-3 appearance-none border rounded-l focus:outline-none"
            :class="{ 'border-red-600': errorMessage }"
            :value="inputValue"
            v-on="inputEvents"
          />
        </template>
      </DatePicker>
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

Besides `input`s, other elements may be effectively used as the default slot. When doing so, there are other slot variables that you may use to further customize date selection behavior.

:::tip
See the [date picker examples](/examples/datepickers.html) for more guidance on using these slot variables.
:::

Here is a comprehensive list of the available slot props.

| Prop | Type | Description |
| --- | --- | --- |
| `inputValue` | Object | Input text value. |
| `inputEvents` | Object   | Events that are configured based on the props provided to `DatePicker`, including `input`, `change` and `keyup`. Props like `update-on-input` and `input-debounce` are handled appropriately. |
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
<DatePicker v-model="date" is-required>
  <template v-slot="{ inputValue, inputEvents }">
    <input
      class="bg-white border px-2 py-1 rounded"
      :value="inputValue"
      v-on="inputEvents"
    />
  </template>
</DatePicker>
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