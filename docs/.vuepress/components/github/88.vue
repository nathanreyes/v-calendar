<template>
  <div>
    <div class="mb-2">
      <button @click="showPicker">Show</button>
    </div>
    <v-date-picker :mode="mode" v-model="selectedDate" ref="picker" />
  </div>
</template>

<script>
// export const title = 'v-date-picker is-dark turns the field dark as well';

export default {
  githubTitle: 'Opening date picker programmatically',
  data() {
    return {
      mode: 'single',
      selectedDate: null,
    };
  },
  methods: {
    showPicker() {
      // this.$refs.picker.$refs.popover.show();
      this.$refs.picker.$refs.popover.show();
    },
  },
};
</script>