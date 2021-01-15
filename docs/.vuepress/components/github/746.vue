<template>
  <div>
    <v-date-picker v-model="date" :mode="mode" :is24hr="is24hr" :masks="masks">
      <template v-slot="{ inputValue, inputEvents }">
        <input :value="inputValue" v-on="inputEvents" />
      </template>
    </v-date-picker>
    <div>
      {{ date }}
    </div>
  </div>
</template>

<script>
export default {
  githubTitle: 'Support input mask for dateTime mode',
  data() {
    return {
      date: new Date(),
      mode: 'dateTime',
      is24hr: true,
      masks: {
        input: 'DD/MM/YYYY',
        inputDateTime: 'DD/MM/YYYY hh:mm A',
        inputDateTime24hr: 'DD/MM/YYYY HH:mm',
      },
    };
  },
};
</script>
