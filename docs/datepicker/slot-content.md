# Slot Content

## Default slot

When a default slot is used with `VDatePicker`, that content will display instead of the calendar picker.

<Example centered>
  <DateSimpleSlot />
</Example>

```vue
<template>
  <VDatePicker v-model="date">
    <template #default="{ togglePopover }">
      <button
        class="px-3 py-2 bg-blue-500 text-sm text-white font-semibold rounded-md"
        @click="togglePopover"
      >
        Select date
      </button>
    </template>
  </VDatePicker>
</template>
```

In this simple example, we display a `<button />` as the default slot, and use one of the slot props provided to toggle the calendar popover.

## Slot props

The full date picker context is bound to the default slot. Here are a few props that might be useful for you. 

```ts
interface DatePickerContext {
  // Value to bind to input element(s)
  inputValue: string | { start: string; end: string }; 
  // Events to bind to input element(s)
  inputEvents: object;
  // Popover show/hide methods
  showPopover: (opts?: Partial<PopoverOptions>) => void;
  hidePopover: (opts?: Partial<PopoverOptions>) => void;
  togglePopover: (opts: Partial<PopoverOptions>) => void;
  // ...,
}
```

## Input element

To support date text entry, provide a custom `input` element as the default slot. `VDatePicker` provides formatting, parsing and event handling out of the box via the following slot props:

- `inputValue`: The is the value you should bind to your input. This value will update as new dates are assigned and validated by the component.
- `inputEvents`: These events include handlers for events that manage debounce, value updates and showing/hiding the popover (as specified via the `popover` prop).

<BaseAlert title="Popover events" info>

To exclude popover events from `inputEvents`, assign a falsy value to the `popover` prop.
</BaseAlert>

<Example centered>
  <DateInputIntro />
</Example>

```vue
<template>
  <VDatePicker v-model="date">
    <template #default="{ inputValue, inputEvents }">
      <BaseInput :value="inputValue" v-on="inputEvents" />
    </template>
  </VDatePicker>
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
  <VDatePicker v-model="range" is-range>
    <template #default="{ inputValue, inputEvents }">
      <div class="flex justify-center items-center">
        <BaseInput :value="inputValue.start" v-on="inputEvents.start" />
        <IconArrowRight />
        <BaseInput :value="inputValue.end" v-on="inputEvents.end" />
      </div>
    </template>
  </VDatePicker>
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
  <VDatePicker v-model="date" :input-debounce="500">
    <template #default="{ inputValue, inputEvents }">
      <BaseInput :value="inputValue" v-on="inputEvents" />
    </template>
  </VDatePicker>
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
  <VDatePicker v-model="date" :update-on-input="false">
    <template v-slot="{ inputValue, inputEvents }">
      <BaseInput :value="inputValue" v-on="inputEvents" />
    </template>
  </VDatePicker>
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
  <VDatePicker v-model="date" :locale="locale">
    <template v-slot="{ inputValue, inputEvents }">
      <BaseInput :value="inputValue" v-on="inputEvents" />
    </template>
  </VDatePicker>
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
  <VDatePicker v-model="date" :masks="masks">
    <template v-slot="{ inputValue, inputEvents }">
      <BaseInput :value="inputValue" v-on="inputEvents" />
    </template>
  </VDatePicker>
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


The `popover` prop determines how popover events are generated in the `inputEvents` slot prop.

```ts
type PopoverProp = boolean | Partial<PopoverOptions>;

interface PopoverOptions {
  visibility: PopoverVisibility; // When the popover appears
  placement: Placement; // Where the popover appears
  autoHide: boolean; // Auto-hide popover based on visibility
  showDelay: number; // Delay (ms) before popover is shown
  hideDelay: number; // Delay (ms) before popover is hidden
}

type PopoverVisibility = 'click' | 'hover' | 'hover-focus' | 'focus';
```

### Default behavior

The `popover` prop is `true` by default, which means that the events will use the following default settings.

```json
{
  visibility: 'hover-focus',
  autoHide: true,
  placement: 'bottom-start',
  showDelay: 0,
  hideDelay: 110,
}
```

Now, if the `inputEvents` have been properly bound to an `input` element, then the popover will display as the user interacts with the input popover.

<Example centered>
  <DatePopoverDefault />
</Example>

```vue
<template>
  <VDatePicker v-model="date" :popover="popover">
    <template #default="{ inputValue, inputEvents }">
      <BaseInput :value="inputValue" v-on="inputEvents" />
    </template>
  </VDatePicker>
</template>

<script setup>
import { ref } from 'vue';

const date = ref(new Date());
const popover = ref(true);
</script>
```

### Custom behavior

To customize this behavior, provide a custom `PopoverOptions` object.

<Example centered>
  <DatePopoverCustom />
</Example>

```vue
<template>
  <VDatePicker v-model="date" :popover="popover">
    <template #default="{ inputValue, inputEvents }">
      <BaseInput :value="inputValue" v-on="inputEvents" />
    </template>
  </VDatePicker>
</template>

<script setup>
import { ref } from 'vue';

const date = ref(new Date());
const popover = ref({
  visibility: 'click',
  placement: 'right',
});
</script>
```

### Manual Control

You may choose to not bind popover behavior to the `inputEvents`, or you may not be using an `input` element at all. In that case, you can manually show/hide the popover by using the provided slot prop functions. 

1. Assign a falsy value to the `popover` prop to unbind popover events from `inputEvents`.
2. Extract the relevant popover methods needed (`togglePopover`, `showPopover`, `hidePopover`) to show/hide the popover manually.

<Example centered>
  <DatePopoverManual />
</Example>

```vue
<template>
  <VDatePicker v-model="date" :popover="false">
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
  </VDatePicker>
</template>

<script setup>
import { ref } from 'vue';

const date = ref(new Date());
</script>
```

<BaseAlert>

See the [date picker examples](/examples/date-picker-popovers) for more guidance on using these slot variables.
</BaseAlert>