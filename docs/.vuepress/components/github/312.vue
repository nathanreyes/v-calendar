<template>
  <div class="hello">
    <div class="datePicker">
      <button @click="addAttributes">Add attributes</button>
      <button @click="removeAttributes">Remove attributes</button>
      <v-date-picker
        mode="range"
        :value="null"
        :attributes="attributes"
        :locale="{ id: 'de', firstDayOfWeek: 2, masks: { weekdays: 'WW' } }"
        is-dark
      />
    </div>
  </div>
</template>

<script>
export default {
  githubTitle: `Calendar highlights won't be removed after attribute changes`,
  data() {
    return {
      locale: { id: 'de', firstDayOfWeek: 2, masks: { weekdays: 'WW' } },
      attributes: [],
    };
  },
  methods: {
    addAttributes() {
      this.attributes = [
        {
          dates: ['2019-05-17', '2019-05-18', '2019-05-19'],
          highlight: {
            color: 'red',
            class: 'test',
          },
          key: 'attribute1',
        },
        {
          dates: ['2019-05-25', '2019-05-26', '2019-05-27'],
          highlight: {
            color: 'red',
            class: 'test',
          },
          key: 'attribute2',
        },
      ];
    },
    removeAttributes() {
      this.attributes = [];
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.datePicker {
  width: 300px;
}
</style>
