<template>
  <VDatePicker v-model="model" :attributes="attrs" @dayclick="dateSelected" />
</template>

<script>
export default {
  data() {
    return {
      model: new Date(),
      attrs: [
        {
          highlight: true,
          dates: {
            start: new Date(),
            end: new Date(new Date().getFullYear() + 1, 0),
          },
          customData: {
            test: 'test',
          },
        },
      ],
    };
  },
  methods: {
    dateSelected(day) {
      console.log(day.attributes);
    },
  },
};
</script>
