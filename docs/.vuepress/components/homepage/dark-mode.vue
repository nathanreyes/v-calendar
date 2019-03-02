<template>
  <div class="border-t border-b border-grey-9 my-10 shadow-inner" :style="bgStyle">
    <div class="section">
      <h2 class="h2 text-grey-2 mb-4">Dark Mode</h2>
      <p class="text-grey-5 mb-8 text-lg">Darken all the things</p>
      <div class="flex flex-col items-center md:flex-row md:justify-around">
        <div class="mb-6">
          <v-calendar color="blue" :attributes="attributes" is-dark/>
        </div>
        <div class="mb-6">
          <v-calendar color="red" :attributes="attributes" is-dark/>
        </div>
      </div>
      <div class="flex flex-col items-center md:flex-row md:justify-around">
        <div class="mb-6">
          <v-calendar color="teal" :attributes="attributes" is-dark/>
        </div>
        <div class="mb-6">
          <v-calendar color="purple" :attributes="attributes" is-dark/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const { getThisMonthComps, getNextMonthComps } = require('@/utils/helpers');
let { month, year } = getThisMonthComps();

export default {
  data() {
    return {
      bgStyle: {
        backgroundImage: `linear-gradient(to bottom right,hsl(209, 34%, 30%),hsl(209, 61%, 16%))`,
      },
      attributes: [
        {
          highlight: true,
          dates: {
            start: new Date(year, month - 1, 7),
            end: new Date(year, month - 1, 20),
          },
        },
      ],
    };
  },
  methods: {
    getAttrs(color) {
      return [
        {
          highlight: true,
          dates: {
            start: new Date(year, month - 1, 7),
            end: new Date(year, month - 1, 20),
          },
        },
      ];
    },
  },
};
</script>