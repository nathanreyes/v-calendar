<template>
  <v-calendar :attributes="attributes" />
</template>

<script>
export default {
  githubTitle: `Two instances of vCalendar override each other. DatePicker is fine.`,
  data() {
    return {
      attributes: [],
    };
  },
};
</script>
