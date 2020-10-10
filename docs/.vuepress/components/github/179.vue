<template>
  <div class="example">
    <v-date-picker v-model="date" />
    <div>
      <span>toString:</span>
      <span class="ml-2">{{ dateString }}</span>
    </div>
    <div>
      <span>toISOString:</span>
      <span class="ml-2">{{ isoString }}</span>
    </div>
    <div>
      <span>toLocaleString:</span>
      <span class="ml-2">{{ localeString }}</span>
    </div>
  </div>
</template>

<script>
export default {
  githubTitle: `Date format and internationalization`,
  data() {
    return {
      date: new Date(),
    };
  },
  computed: {
    dateString() {
      return this.date.toString();
    },
    isoString() {
      return this.date.toISOString();
    },
    localeString() {
      return this.date.toLocaleString();
    },
  },
};
</script>
