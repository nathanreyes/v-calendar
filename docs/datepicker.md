---
title: 'Date & Time Picker :tada:'
sidebarDepth: 2
---

# Date Picker

:::warning
`v2.0.0` has introduced a significant number of breaking changes.

[Read the upgrade guide for details.](/changelog/v2.0.html)
:::

`v-date-picker` is a feature-rich date picker implemented as a wrapper for `v-calendar`. That means that, out of the box, it accepts all props and emits all of the same events.

## Single Dates

`v-date-picker` can bind to single dates using the `v-model` directive.

<guide-datepicker-simple-date />

```html
<v-date-picker v-model="date" />
```

```js
data() {
  return {
    date: new Date(),
  }
}
```

## Date Ranges

Binding to date ranges is also supported by setting the `is-range` prop.

<guide-datepicker-simple-range />

```html
<v-date-picker v-model="range" is-range />
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

## Selection Modes :tada:

*Introduced in **`v2.0.0`***

Use the `mode` prop to switch between 3 different date selection modes: `date`, `dateTime` and `time`.

:::warning
Previous to `v2.0.0`, the `mode` prop was used to switch between `date`, `range` and `multiple` date selections. As of `v2.0.0`, the `mode` prop has been repurposed for the date and time options. To get the previous `range` mode behavior, use the new `is-range` prop. To get the previous `multiple` mode behavior, [here](./examples/datepickers#multiple-dates-legacy) is an example of how to do that.
:::

### Date

To limit user selection to only date components (month, day, year), use `mode: 'date'`. This is the default prop value, so it isn't explicitly required.

<guide-datepicker-with-value mode="date" />

```html
<v-date-picker mode="date" v-model="date" />
```

### Date & Time

To allow user selection of date and time components, use `mode: 'dateTime'`. A time picker now appears below the calendar.

:::tip
Time components are set using the current timezone setting set by the `timezone` prop. By default, this value is `null`, which specifies the local timezone.
:::

<guide-datepicker-with-value mode="dateTime" />

```html
<div>
  <div class="flex mb-2">
    <label class="text-gray-600 font-medium"><input class="mr-1" type="radio" value="" v-model="timezone">Local</label>
    <label class="text-gray-600 font-medium ml-3"><input class="mr-1" type="radio" value="utc" v-model="timezone">UTC</label>
  </div>
  <v-date-picker v-model="date" mode="dateTime" :timezone="timezone" />
</div>
```

```js
data() {
  return {
    date: new Date(),
    timezone: '',
  }
}
```

#### 24-hr Mode

Use the `is24hr` prop to adjust the hour `select` element and default input format for 24-hr mode.

<guide-datepicker-24hr />

```html
<v-date-picker v-model="date" mode="dateTime" is24hr>
  <template v-slot="{ inputValue, inputEvents }">
    <input
      class="px-2 py-1 border rounded focus:outline-none focus:border-blue-300"
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

#### Minute Increments

Use the `minute-increment` prop to set custom intervals for the minute `select` options.

<guide-datepicker-minute-increment />

```html
<v-date-picker v-model="date" mode="dateTime" :minute-increment="5" />
```

```js
export default {
  data() {
    let date = new Date();
    date.setMinutes(0, 0, 0);
    return {
      date,
    };
  },
};
```

:::warning
If the bound date does not match of the the minute options derived by the `minute-increment` amount, the accurate `minute` amount will be displayed, but this option will be disabled.
:::

### Time

To limit user selction to only time components (hours, minutes, seconds), use `mode: 'time'`.

<guide-datepicker-with-value mode="time" />

```html
<div>
  <div class="flex mb-2" v-if="mode !== 'date'">
    <label class="text-gray-600 font-medium"><input class="mr-1" type="radio" value="" v-model="timezone">Local</label>
    <label class="text-gray-600 font-medium ml-3"><input class="mr-1" type="radio" value="utc" v-model="timezone">UTC</label>
  </div>
  <v-date-picker mode="time" v-model="date" :timezone="timezone" />
  <div class="flex items-baseline mt-2">
    <span class="text-gray-600 font-semibold tracking-wide">Date (ISO):</span>
    <span class="text-gray-800 ml-2">{{ date.toISOString() }}</span>
  </div>
</div>
```

```js
export default {
  data() {
    return {
      date: new Date(),
      timezone: '',
    };
  },
}
```

## Model Config :tada:

*Introduced in **`v2.0.0`***

The `model-config` prop is used to provide information about the date bound to `v-date-picker`. For example, if the date you provide is stored in a database as a string, this string value can be bound to `v-date-picker` directly, without any extra conversion logic required by your application.

In short, the `model-config` and `timezone` props help provide a no-hassle approach to working with your data.

### Strings

To bind to a string value, provide a `model-config` with the necessary `type: 'string'` and `mask` properties.

<guide-datepicker-model-string />

```html
<v-date-picker
  v-model="customer.birthday"
  :model-config="modelConfig"
  is-required
  />
```

```js
export default {
  data() {
    return {
      customer: {
        name: 'Nathan Reyes',
        birthday: '1983-01-21',
      },
      modelConfig: {
        type: 'string',
        mask: 'YYYY-MM-DD', // Uses 'iso' if missing
      },
    }
  }
};
```

### Numbers

To bind to a number value, provide a `model-config` with the necessary `type: 'number'` property.

<guide-datepicker-model-number />

```html
<v-date-picker v-model="customer.birthday" :model-config="modelConfig" />
```

```js
export default {
  data() {
    return {
      customer: {
        name: 'Nathan Reyes',
        birthday: 411976800000, // Milliseconds since 1 January 1970 
      },
      modelConfig: {
        type: 'number',
      },
    }
  }
};
```

### Time Adjust

By default, when the user selects a new date, it leaves the existing time value. To auto-adjust the time for selected dates, provide a `model-config` with the desired `timeAdjust` setting in `HH:mm:ss` format. All times use the specified `timezone`, or local timezone if none is provided.

This example assigns the time of selected dates to noon in the browser's local timezone.

<guide-datepicker-time-adjust />

```html
<v-date-picker v-model="date" :model-config="modelConfig">
```

```js
data() {
  return {
    customer: {
      name: 'Nathan Reyes',
      birthday: '1983-01-21T07:30:00.000Z',
    },
    modelConfig: {
      type: 'string',
      mask: 'iso',
      timeAdjust: '12:00:00',
    },
  }
}
```

| Time Setting | Description |
| --- | --- |
| *`HH:MM:SS`* | Custom time in `HH:MM:SS` format |
| `now` | Assign to the instant of date selection. |

#### Adjust Date Range Times

When used with date ranges, the `modelConfig` may be specified as an object with `start` and `end` properties. For example, when the users selects a date range, we might want to set the selected range to start at the very beginning of the first day until the end of the last day.

<guide-datepicker-time-adjust-range />

```html
<v-date-picker v-model="range" :model-config="modelConfig" is-range >
```

```js
data() {
  return {
    range: {
      start: new Date(2020, 0, 6),
      end: new Date(2020, 0, 9),
    },
    modelConfig: {
      start: {
        timeAdjust: '00:00:00',
      },
      end: {
        timeAdjust: '23:59:59',
      },
    },
  }
}
```

## Popovers

To display the picker as a popover, provide your own content as the default slot. Most often this will be an `input` element.

:::warning
As of `v2.0.0`, `v-date-picker` no longer provides an `input` element as the default slot. This slot **must** be provided by the developer. Additionally, the `inputProps` prop as been deprecated in favor of simply binding the input value to the `inputValue` slot prop.
:::

### Input

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

### Range Inputs

When binding to a date range and providing custom `input` elements, the `inputValue` and `inputEvents` are split into separate `start` and `end` sub-properties. 

<guide-datepicker-range-input />

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

Please reference the [formatting & parsing section](./format-parse-dates.md) for a complete list of available mask tokens.

### Form Example

Here is a more complex example using a custom input with a validation message and **Clear** button to clear out the date.

<guide-readme-dp-custom-slot />

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

Refer to the [disabling dates section](./disable-dates.md).

## Require Selected Date

Setting the `is-required` prop will prevent clearing the date value by deleting all text from the `input` element or re-selecting a picker date.

<guide-datepicker-is-required />

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
