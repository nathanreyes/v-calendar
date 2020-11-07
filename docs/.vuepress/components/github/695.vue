<template>
  <div class="container">
    <v-date-picker :popover="popover" v-model="date">
      <template #default="{ inputValue, inputEvents }">
        <input :value="inputValue" v-on="inputEvents" />
      </template>
    </v-date-picker>
  </div>
</template>

<script>
export default {
  githubTitle: 'Popper options not working',
  data() {
    return {
      date: new Date(),
      popover: {
        positionFixed: true,
      },
    };
  },
};
</script>

<style scoped>
.container {
  height: 60px;
  overflow: hidden;
  background-color: red;
}
</style>