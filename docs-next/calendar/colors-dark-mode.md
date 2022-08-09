<script>
export default {
  data() {
    const colors = [
      {
        value: 'gray',
        label: 'Gray',
        class: 'text-gray-800 hover:bg-gray-100 border border-gray-500',
        selectedClass: 'bg-gray-500 ',
      },
      {
        value: 'red',
        label: 'Red',
        class: 'text-red-800 hover:bg-red-100 border-red-500',
        selectedClass: 'bg-red-500 ',
      },
      {
        value: 'orange',
        label: 'Orange',
        class: 'text-orange-800 hover:bg-orange-100 border-orange-500',
        selectedClass: 'bg-orange-500 ',
      },
      {
        value: 'yellow',
        label: 'Yellow',
        class: 'text-yellow-800 hover:bg-yellow-100 border-yellow-500',
        selectedClass: 'bg-yellow-500 ',
      },
      {
        value: 'green',
        label: 'Green',
        class: 'text-green-800 hover:bg-green-100 border-green-500',
        selectedClass: 'bg-green-500 ',
      },
      {
        value: 'teal',
        label: 'Teal',
        class: 'text-teal-800 hover:bg-teal-100 border-teal-500',
        selectedClass: 'bg-teal-500 ',
      },
      {
        value: 'blue',
        label: 'Blue',
        class: 'text-blue-800 hover:bg-blue-100 border-blue-500',
        selectedClass: 'bg-blue-500 ',
      },
      {
        value: 'indigo',
        label: 'Indigo',
        class: 'text-indigo-800 hover:bg-indigo-100 border-indigo-500',
        selectedClass: 'bg-indigo-500 ',
      },
      {
        value: 'purple',
        label: 'Purple',
        class: 'text-purple-800 hover:bg-purple-100 border-purple-500',
        selectedClass: 'bg-purple-500 ',
      },
      {
        value: 'pink',
        label: 'Pink',
        class: 'text-pink-800 hover:bg-pink-100 border-pink-500',
        selectedClass: 'bg-pink-500 ',
      },
    ];
    return {
      selectedColor: colors.find(c => c.value === 'blue'),
      colors_1: colors.slice(0, 5),
      colors_2: colors.slice(5, 10),
      isDark: false,
      attrs: [
        {
          key: 'test',
          highlight: true,
          dates: { start: new Date(2019, 3, 15), end: new Date(2019, 3, 19) },
        },
      ],
    };
  },
  computed: {
    darkClass() {
      const shared =
        'text-sm font-semibold block w-64 rounded py-1 mb-4 focus:outline-none';
      if (this.isDark) {
        return `${shared} bg-gray-800 text-white`;
      }
      return `${shared} hover:bg-gray-200 border border-gray-800 text-gray-900`;
    },
  },
  methods: {
    colorClass(color) {
      const sharedClasses = `inline-block text-sm border rounded py-1 mb-2 focus:outline-none w-16`;
      if (color === this.selectedColor) {
        return `${sharedClasses} ${color.selectedClass} text-white font-semibold`;
      }
      return `${sharedClasses} ${color.class} font-medium`;
    },
  },
};
</script>

# Colors & Dark Mode

You can apply a color or dark mode by using the `color` and `is-dark` props.

:::tip
The following colors are provided out of the box: **gray**, **red**, **orange**, **yellow**, **green**, **teal**, **blue**, **indigo**, **purple**, **pink**.
:::

<div class="example">
  <div class="flex justify-center mb-1">
    <button
      v-for="color in colors_1"
      :key="color.value"
      class="mx-1"
      :class="colorClass(color)"
      @click="selectedColor = color"
    >{{ color.label}}</button>
  </div>
  <div class="flex justify-center mb-2">
    <button
      v-for="color in colors_2"
      :key="color.value"
      class="mx-1"
      :class="colorClass(color)"
      @click="selectedColor = color"
    >{{ color.label}}</button>
  </div>
  <div class="flex justify-center mb-2">
    <button :class="darkClass" @click="isDark = !isDark">Dark</button>
  </div>
  <div class="flex justify-center">
    <Calendar
      :color="selectedColor.value"
      :is-dark="isDark"
      :attributes="attrs"
      :from-page="{ month: 4, year: 2019 }"
    />
  </div>
</div>

<div class="example is-dark">
  <div class="flex justify-center">
    <DatePicker
      :model-value="null"
      color="red"
      is-dark
      is-range
      />
  </div>
</div>

```html
<DatePicker
  :value="null"
  color="red"
  is-dark
  is-range
  />
```