<template>
  <v-date-picker
    color="red"
    is-dark
    is-expanded
    :rows="$screens({ md: 2 }, 1)"
    :columns="$screens({ md: 2 }, 1)"
    :max-date="new Date()"
    v-model="dates"
    mode="range"
  />
</template>

<script>
export default {
  githubTitle: `Duplicate month when first load`,
  data() {
    const current = new Date();
    const first = new Date();
    first.setDate(1);

    return {
      dates: {
        start: first,
        end: current,
      },
    };
  },
};
</script>
