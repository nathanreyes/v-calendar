<template>
  <div>
    <v-date-picker
      mode="datetime"
      v-model="date"
      :timezone="timezone"
      :model-config="modelConfig"
      is-required
    />
    <div>
      {{ date }}
    </div>
  </div>
</template>

<script>
export default {
  githubTitle:
    'Timezones do not work correctly with ISO-8601 dates passed as a string value',
  data() {
    return {
      // date: '2020-01-02T12:00:00.000Z',
      date: '2021-01-15T04:15:00Z',
      // date: new Date(),
      // date: new Date(),
      modelConfig: {
        type: 'string',
        mask: 'YYYY-MM-DDTHH:mm:ss.SSSZ',
      },
      // timezone: 'Europe/Kiev',
      timezone: 'utc',
    };
  },
};
</script>
