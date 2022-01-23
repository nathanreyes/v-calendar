<template>
  <div class="example">
    <v-date-picker v-model="date" mode="dateTime" v-bind="$attrs" />
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
  data() {
    return {
      date: new Date(),
    };
  },
};
</script>
