<template>
  <div class="example">
    <v-date-picker v-model="dates" mode="multiple" is-inline/>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dates: [new Date(2018, 0, 9), new Date(2018, 0, 25)],
    };
  },
};
</script>

