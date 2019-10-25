<template>
  <v-date-picker
    mode="multiple"
    v-model="value"
    :disabled-dates="disabledDates"
  >
    <template v-slot="{ inputProps, inputEvents }">
      <input
        class="input"
        :style="{ paddingLeft: '25px' }"
        :value="inputProps.value"
        v-bind="inputProps"
        v-on="inputEvents"
      />
    </template>
  </v-date-picker>
</template>

<script>
export default {
  githubTitle: 'Safari Issue on September 8, 2019',
  data() {
    return {
      value: null,
      disabledDates: [{ start: this.getTomorrow() }],
    };
  },
  methods: {
    getTomorrow() {
      const tomorrow = new Date();
      tomorrow.setDate(new Date().getDate() + 1);
      return tomorrow;
    },
  },
};
</script>