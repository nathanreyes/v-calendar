<template>
  <div>
    <button @click="toggleLocale">Toggle locale</button>
    <v-date-picker
      ref="calendar"
      v-model="range"
      mode="range"
      :locale="locale"
    />
  </div>
</template>

<script>
export default {
  githubTitle: 'Locale change only changes weekday names but not month names',
  data() {
    return {
      locale: {
        id: 'de',
        firstDayOfWeek: 2,
        masks: { weekdays: 'WW' },
      },
      range: {},
    };
  },
  methods: {
    toggleLocale() {
      this.locale.id = this.locale.id === 'fr' ? 'de' : 'fr';
    },
  },
};
</script>
