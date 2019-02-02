<template>
  <div class='example'>
    <v-date-picker
      v-model='date'
      :input-debounce='500'>
    </v-date-picker>
  </div>
</template>

<script>
export default {
  data() {
    return {
      date: null,
    };
  },
};
</script>

