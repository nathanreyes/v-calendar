---
title: Date Picker | Custom Attributes
---

# Custom Attributes

`DatePicker` uses the following props to display date selections:

## Select Attribute

| Attribute | Description |
| --------- | ----------- |
| `select-attribute` | Attribute used to represent the selected value. |
| `drag-attribute` | Attribute used to represent the dragged value. Valid only when `mode === "range"`. |

To customize these attributes, we just need to provide our own custom attributes objects. Any attributes we provide will replace the default ones.

::: tip
Both attributes are assigned a key of `"select-drag"`.
:::

For example, say we want to use a `dot` instead of a `highlight` to denote the selected date. All we would need to do is pass a new `select-attribute`:

<!-- <guide-datepicker-select-attribute /> -->

```html
<DatePicker
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

## Drag Attribute

## Selection Popover

Finally, let's look at an example of adding a simple popover to the dragged and selected date ranges. Note that here we include the `day-popover` slot, and make sure to assign a truthy value to the `popover` property of the attribute.

We'll first try to display the dragged range, then fall back to the selected range.

<!-- <guide-datepicker-range-popover /> -->

```html
<DatePicker
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
</DatePicker>
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