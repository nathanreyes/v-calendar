<template>
  <div class="bg-grey-8 my-10 shadow-inner">
    <div class="max-w-md mx-auto px-4 py-10">
      <h3 class="text-grey-2 mb-10">Dark Mode Supported</h3>
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
          <v-calendar color="cyan" :attributes="attributes" is-dark/>
        </div>
        <div class="mb-6">
          <v-calendar color="grey" :attributes="attributes" is-dark/>
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
