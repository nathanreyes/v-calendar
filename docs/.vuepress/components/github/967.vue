<template>
  <div class="flex flex-col items-start w-full">
    <label for="visible">
      <input id="visible" type="checkbox" v-model="visible" />
      Visible
    </label>
    <v-date-picker v-if="visible" v-model="date" mode="datetime" />
  </div>
</template>

<script>
export default {
  githubTitle: 'Memory issue?',
  data() {
    return {
      visible: true,
      date: new Date(),
    };
  },
};
</script>
