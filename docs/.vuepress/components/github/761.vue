<template>
  <div>
    <v-calendar :attributes="attributes" @dayclick="addDayAttribute" />
  </div>
</template>

<script>
export default {
  githubTitle: 'Dates in attributes array not updating reactively',
  data() {
    return {
      attributes: [
        {
          dates: [new Date()],
          highlight: true,
        },
      ],
    };
  },
  methods: {
    addDayAttribute(day) {
      // this.attributes.push({
      //   dates: day.date,
      //   highlight: true,
      // });
      const attr = this.attributes[0];
      attr.dates.push(day.date);
    },
  },
};
</script>
