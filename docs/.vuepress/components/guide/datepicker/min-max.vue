<template>
  <div class="example">
    <v-date-picker
      v-model="date"
      :min-date="new Date(2018, 0, 1)"
      :max-date="new Date(2018, 0, 31)"
      is-inline
    ></v-date-picker>
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

