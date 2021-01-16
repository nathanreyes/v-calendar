<template>
  <div class="example">
    <v-calendar :min-date="minDate" :max-date="maxDate" />
  </div>
</template>

<script>
export default {
  githubTitle: `Can't use the popover navigation correctly when set "min-date" or "max-date"`,
  data() {
    return {
      minDate: new Date(2020, 0, 12),
      maxDate: new Date(2021, 0, 12),
    };
  },
};
</script>