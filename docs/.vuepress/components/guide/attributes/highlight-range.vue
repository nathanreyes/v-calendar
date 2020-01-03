<template>
  <div class="example">
    <v-calendar :from-page="{ month: 1, year: 2019}" :attributes="attrs"/>
  </div>
</template>

<script>
export default {
  props: {
    base: { type: Object, default: () => ({ fillMode: 'light' }) },
    start: { type: Object, default: () => ({ fillMode: 'solid' }) },
    end: { type: Object, default: () => ({ fillMode: 'solid' }) },
  },
  computed: {
    attrs() {
      return [
        {
          highlight: {
            base: this.base,
            start: this.start,
            end: this.end,
          },
          dates: { start: new Date(2019, 0, 14), end: new Date(2019, 0, 18) },
        },
      ];
    },
  },
};
</script>
