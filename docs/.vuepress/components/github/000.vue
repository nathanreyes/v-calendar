<template>
  <div>
    <div>
      <v-date-picker
        mode="dateTime"
        v-model="date"
        :model-config="modelConfig"
        timezone="UTC"
      >
        <template #default="{ inputValue, inputEvents }">
          <input :value="inputValue" v-on="inputEvents" />
        </template>
      </v-date-picker>
    </div>
    <div>{{ date }}</div>
  </div>
</template>

<script>
export default {
  githubTitle: 'Open Test',
  data() {
    return {
      date: '2022-02-09T00:42:00.000Z',
      modelConfig: {
        type: 'string',
        mask: 'iso',
        // fillDate: new Date(2021, 0, 1),
        validHours: [0, 3, 4, 5, 8, 16, 20],
      },
    };
  },
};
</script>
