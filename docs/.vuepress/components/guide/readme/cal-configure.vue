<template>
  <div class="example">
    <div class="flex justify-center flex-wrap list-reset mb-4">
      <button
        v-for="color in colors"
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
    <v-calendar :color="selectedColor.value" :is-dark="isDark" :attributes="attrs"/>
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
      selectedColor: colors[0],
      colors,
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
