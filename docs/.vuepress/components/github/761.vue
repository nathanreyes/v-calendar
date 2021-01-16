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
          dates: new Date(2021, 0, 14),
          highlight: true,
        },
      ],
    };
  },
  methods: {
    addDayAttribute(day) {
      this.attributes.push({
        dates: day.date,
        highlight: true,
      });
    },
  },
};
</script>
