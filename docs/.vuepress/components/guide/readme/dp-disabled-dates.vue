<template>
  <div class="example">
    <v-date-picker
      v-model="date"
      :disabled-dates="disabled"
      :columns='2'
      timezone='Pacific/Auckland'
      @update:to-page='onUpdateToPage'
    />
  </div>
</template>

<script>
export default {
  data() {
    console.time('Timer')
    const disabled = []
    for (let day = 1; day <= 32; day++) {
      disabled.push(new Date(2023, 7, day))
      disabled.push(new Date(2023, 8, day))
      disabled.push(new Date(2023, 9, day))
    }
    console.log(disabled);
    return {
      disabled,
      date: null,
    };
  },
  methods: {
    onUpdateToPage () {
      console.timeEnd('Timer');
    },
  }
};
</script>
