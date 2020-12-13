<template>
  <div
    class="border-t border-b border-gray-900 -mx-4 my-10 shadow-inner"
    :style="bgStyle"
  >
    <div class="section">
      <h2 class="text-gray-200">Dark Mode</h2>
      <p class="text-lg font-medium text-gray-500 mb-6">
        Darken all the things
      </p>
      <div class="flex flex-col items-center lg:flex-row lg:justify-around">
        <div class="mb-6">
          <v-calendar color="blue" :attributes="attributes" is-dark />
        </div>
        <div class="mb-6">
          <v-calendar color="red" :attributes="attributes" is-dark />
        </div>
      </div>
      <div class="flex flex-col items-center lg:flex-row lg:justify-around">
        <div class="mb-6">
          <v-calendar color="teal" :attributes="attributes" is-dark />
        </div>
        <div class="mb-6">
          <v-calendar color="purple" :attributes="attributes" is-dark />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    const date = new Date();
    const month = date.getMonth();
    const year = date.getFullYear();
    return {
      month,
      year,
      bgStyle: {
        backgroundImage: `linear-gradient(to bottom right,hsl(209, 18%, 30%),hsl(210, 24%, 16%))`,
      },
      attributes: [
        {
          highlight: true,
          dates: {
            start: new Date(year, month, 7),
            end: new Date(year, month, 20),
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
            start: new Date(this.year, this.month, 7),
            end: new Date(this.year, this.month, 20),
          },
        },
      ];
    },
  },
};
</script>
