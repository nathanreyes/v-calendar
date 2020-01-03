### Colors & Dark Mode

You can apply a theme color or dark mode by using the `color` and `is-dark` props.

:::tip
The following colors are provided out of the box: **gray**, **red**, **orange**, **yellow**, **green**, **teal**, **blue**, **indigo**, **purple**, **pink**.
:::

<guide-readme-cal-configure />

<div class="example is-dark">
  <v-date-picker
    mode="range"
    :value="null"
    color="red"
    is-dark
    is-inline
    />
</div>

```html
<v-date-picker
  mode="range"
  :value="null"
  color="red"
  is-dark
  is-inline
  />
```