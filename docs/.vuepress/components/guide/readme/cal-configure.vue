<template>
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
      <!-- <li class="mr-3">
        <a
          class="inline-block border border-blue rounded py-1 px-3 bg-blue text-white"
          href="#"
        >Active Pill</a>
      </li>-->
    </div>
    <button :class="darkClass" @click="isDark = !isDark">Dark</button>
    <v-calendar
      :color="selectedColor.value"
      :is-dark="isDark"
      :attributes="attrs"
      :from-page="{ month: 4, year: 2019 }"
    />
  </div>
</template>

<script>
export default {
  data() {
    const colors = [
      {
        value: 'gray',
        label: 'Gray',
      },
      {
        value: 'red',
        label: 'Red',
      },
      {
        value: 'orange',
        label: 'Orange',
      },
      {
        value: 'yellow',
        label: 'Yellow',
      },
      {
        value: 'green',
        label: 'Green',
      },
      {
        value: 'teal',
        label: 'Teal',
      },
      {
        value: 'blue',
        label: 'Blue',
      },
      {
        value: 'indigo',
        label: 'Indigo',
      },
      {
        value: 'purple',
        label: 'Purple',
      },
      {
        value: 'pink',
        label: 'Pink',
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
      const sharedClasses = `inline-block text-sm border border-${
        color.value
      }-500 rounded py-1 mb-2 focus:outline-none w-16`;
      if (color === this.selectedColor) {
        return `${sharedClasses} bg-${
          color.value
        }-500 text-white font-semibold`;
      }
      return `${sharedClasses} text-${color.value}-800 hover:bg-${
        color.value
      }-100 font-medium`;
    },
  },
};
</script>
