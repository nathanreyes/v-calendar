<template>
  <div>
    <button @click="changeRange">Click me!</button>
    <v-calendar
      :attributes="attributes"
      :min-date="minDate"
      :max-date="maxDate"
    />
  </div>
</template>

<script>
export default {
  githubTitle: '`showPageRange` method not working yet?',
  data() {
    return {
      attributes: [],
      minDate: new Date(2019, 7, 10),
      maxDate: new Date(2019, 7, 20),
    };
  },
  methods: {
    changeRange() {
      this.minDate = new Date(2019, 7, 1);
      this.maxDate = new Date(2019, 7, 30);
    },
  },
};
</script>
