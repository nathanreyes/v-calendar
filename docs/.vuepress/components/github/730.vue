<template>
  <div>
    <v-date-picker
      mode="datetime"
      v-model="date"
      :model-config="modelConfig"
      :timezone="timezone"
    />
    <div>
      {{ date }}
    </div>
  </div>
</template>

<script>
export default {
  githubTitle: 'False sign of timezones UTC offset in datepicker',
  data() {
    return {
      date: null,
      modelConfig: {
        type: 'string',
      },
      timezone: 'America/New_York',
    };
  },
};
</script>
