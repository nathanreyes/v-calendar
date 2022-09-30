# Slot Content

## Default slot

When a default slot is used with `DatePicker`, that slot content will display instead of the calendar picker.

## Input element

To support date text entry, provide a custom `input` element as the default slot. `DatePicker` provides formatting, parsing and event handling out of the box via the following slot props:

- `inputValue`: The is the value you should bind to your input. This value will update as new dates are assigned and validated by the component.
- `inputEvents`: These events include handlers for events that ultimately assign new dates and manage the appearance of the popover (as specified via the `popover` prop).

<Example centered>
  <DateInputIntro />
</Example>

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

### Range Inputs

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
        <IconArrowRight />
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

### Debounce

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

### Disable Update On Input

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

### Input Format

#### Locale

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

#### Mask

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

Please reference the [masks section](../i18n/masks#mask-tokens) for a complete list of available mask tokens.

## Popover

### Default behavior

The `popover` prop determines how popover events are included in the `inputEvents` slot prop. If this prop is `true` (default), and the `inputEvents` have been properly bound to an `input` element, then the popover will display as the user interacts with the input popover.

### Custom behavior

The `popover` prop also accepts an object with custom popover settings.

### Manual Control

You may choose to not bind popover behavior to the `inputEvents`, or you may not be using an `input` element at all. In that case, you can manually show/hide the popover by using the provided slot prop functions. 

1. Assign a falsy value to the `popover` prop.
2. Extract the relevant popover methods needed (`togglePopover`, `showPopover`, `hidePopover`) to show/hide the popover manually.

<Example centered>
  <DateCustomSlot />
</Example>

```vue
<template>
  <DatePicker v-model="date" :popover="false">
    <template #default="{ togglePopover, inputValue, inputEvents }">
      <div
        class="flex rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden"
      >
        <button
          class="flex justify-center items-center px-2 bg-accent-100 hover:bg-accent-200 text-accent-700 border-r border-gray-300 dark:bg-gray-700 dark:text-accent-300 dark:border-gray-600 dark:hover:bg-gray-600"
          @click="() => togglePopover()"
        >
          <IconCalendar class="w-5 h-5" />
        </button>
        <input
          :value="inputValue"
          v-on="inputEvents"
          class="flex-grow px-2 py-1 bg-white dark:bg-gray-700"
        />
      </div>
    </template>
  </DatePicker>
</template>

<script setup>
import { ref } from 'vue';

const date = ref(new Date());
</script>
```

When doing so, there are other slot variables that you may use to further customize date selection behavior.

```ts
interface DatePickerSlotProps {
  inputValue: string | { start: string; end: string };
  inputEvents: object;
  isDragging: ComputedRef<boolean>;
  // Call to update date value w/ optional side-effects
  updateValue: (value: any, opts?: Partial<UpdateOptions>) => Promise<Date | DateRange | null>;
  showPopover: (opts?: Partial<PopoverOptions>) => void;
  hidePopover: (opts?: Partial<PopoverOptions>) => void;
  togglePopover: (opts: Partial<PopoverOptions>) => void;
}

interface UpdateOptions {
  patch: DatePatch, // Parts of the current date to update,  Default: DateTime
  debounce: number, // Debounce rate (ms), Default: 0
  formatInput: boolean, // Side effect: Format input after update, Default: true
  hidePopover: boolean, // Side effect: Hide popover after update (if visible), Default: false
  moveToValue: boolean, // Side effect: Move calendar to display updated value, Default: false
}

enum DatePatch {
  DateTime = 0,
  Date,
  Time,
}

interface PopoverOptions {
  visibility: PopoverVisibility;
  isInteractive: boolean;
  autoHide: boolean;
  target: string | HTMLElement | ComponentPublicInstance;
  placement: Placement;
  modifiers: any;
  showDelay: number;
  hideDelay: number;
}
```

<BaseAlert>
See the [date picker examples](/examples/datepickers.html) for more guidance on using these slot variables.
</BaseAlert>

<BaseAlert title="Validation" warning>
Values passed to `updateValue()` are validated against `disabled-dates`, `available-dates`, `min-date` and `max-date` props. Side-effects perform only if validation passes.
</BaseAlert>