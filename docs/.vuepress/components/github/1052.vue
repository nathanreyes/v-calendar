<template>
  <div>
    <v-date-picker v-model="date" :model-config="modelConfig">
      <template v-slot="{ inputValue, inputEvents }">
        <input :value="inputValue" v-on="inputEvents" />
      </template>
    </v-date-picker>
    {{ date }}
  </div>
</template>

<script>
export default {
  githubTitle: 'Interact with individual dates of a date-range object',
  data() {
    return {
      date: null,
      modelConfig: {
        type: 'string',
        mask: 'iso',
      },
    };
  },
};
</script>
