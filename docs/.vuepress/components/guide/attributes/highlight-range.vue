<template>
  <div class="example">
    <v-calendar :from-page="{ month: 1, year: 2019 }" :attributes="attrs" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      attrs: [
        {
          highlight: {
            start: { fillMode: 'outline' },
            base: { fillMode: 'light' },
            end: { fillMode: 'outline' },
          },
          dates: { start: new Date(2019, 0, 14), end: new Date(2019, 0, 18) },
        },
      ],
    };
  },
};
</script>
