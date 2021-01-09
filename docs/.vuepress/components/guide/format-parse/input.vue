<template>
  <div class="example">
    <v-date-picker v-model="date">
      <template #default="{ inputValue, inputEvents }">
        <input
          class="px-3 py-1 border rounded"
          :value="inputValue"
          v-on="inputEvents"
        />
      </template>
    </v-date-picker>
  </div>
</template>

<script>
export default {
  data() {
    return {
      date: new Date(),
    };
  },
};
</script>
