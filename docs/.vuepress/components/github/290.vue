<template>
  <v-calendar
    i:from-date="new Date()"
    :attributes="attrs"
    @dayclick="handleClick"
  />
</template>

<script>
export default {
  githubTitle: `Question: Weekly view`,
  data() {
    return {
      attrs: [
        {
          dot: true,
          dates: [],
        },
        {
          highlight: 'blue',
          dates: new Date(),
        },
      ],
    };
  },
  methods: {
    handleClick(event) {
      let { year, month, day } = event;
      // this.attrs[1].dates = new Date(year, month, day); // here the view is not change
      let attrs = this.attrs.slice();
      attrs[1].dates = new Date(year, month - 1, day);
      this.attrs = attrs;
    },
  },
};
</script>