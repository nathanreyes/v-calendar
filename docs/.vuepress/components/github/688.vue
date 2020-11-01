<template>
  <div>
    <v-calendar trim-weeks :rows="1" />
    <!-- <v-date-picker v-model="date" trim-weeks>
      <template #default="{ inputValue, inputEvents }">
        <input :value="inputValue" v-on="inputEvents" />
      </template>
    </v-date-picker> -->
  </div>
</template>

<script>
export default {
  githubTitle: `Trim weeks`,
  data() {
    return {
      date: new Date(),
    };
  },
};
</script>
