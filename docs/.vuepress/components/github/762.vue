<template>
  <div class="example">
    <v-calendar
      :from-page="{ month: 11, year: 2020 }"
      :min-date="minDate"
      :max-date="maxDate"
      :can-move="canMove"
    />
  </div>
</template>

<script>
export default {
  githubTitle: `Can't use the popover navigation correctly when set "min-date" or "max-date"`,
  data() {
    return {
      minDate: null,
      maxDate: null,
      // minDate: new Date(2020, 10, 10),
      // maxDate: new Date(2020, 10, 20),
    };
  },
  methods: {
    canMove(page, result) {
      if (page.month === 2 && page.year === 2020) return false;
    },
  },
};
</script>
