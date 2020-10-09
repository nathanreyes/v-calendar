### Colors & Dark Mode

You can apply a color or dark mode by using the `color` and `is-dark` props.

:::tip
The following colors are provided out of the box: **gray**, **red**, **orange**, **yellow**, **green**, **teal**, **blue**, **indigo**, **purple**, **pink**.
:::

<guide-readme-cal-configure />

<div class="example is-dark">
  <v-date-picker
    :value="null"
    color="red"
    is-dark
    is-range
    />
</div>

```html
<v-date-picker
  :value="null"
  color="red"
  is-dark
  is-range
  />
```