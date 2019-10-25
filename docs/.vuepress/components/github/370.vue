	<template>
  <div>
    <button @click="toggleLocale">Toggle locale</button>
    <v-date-picker
      ref="calendar"
      v-model="range"
      mode="range"
      is-inline
      :locale="locale"
    />
  </div>
</template>

  <script>
export default {
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
  
