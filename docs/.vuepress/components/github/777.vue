<template>
  <v-date-picker :popover="{ placement: 'left' }" v-model="date">
    <template v-slot="{ togglePopover }">
      <button @click="togglePopover">Click to open calendar</button>
    </template>
  </v-date-picker>
</template>

<script>
export default {
  githubTitle: `popover.placement doesn't work`,
  data() {
    return {
      date: new Date(),
      popover: {
        placement: 'left',
      },
    };
  },
};
</script>
