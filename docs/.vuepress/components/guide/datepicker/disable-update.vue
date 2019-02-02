<template>
  <div class='example'>
    <v-date-picker
      v-model='date'
      :update-on-input='false'>
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
