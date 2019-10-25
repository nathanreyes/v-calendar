<template>
  <div>
    <input />
    <v-date-picker v-model="date" :popover="{ visibility: 'hover-focus' }">
      <div slot-scope="{ inputProps, inputEvents }">
        <input v-bind="inputProps" v-on="inputEvents" ref="input" />
        <button class="px-2 py-1 bg-blue-500">Click</button>
      </div>
    </v-date-picker>
    <input />
  </div>
</template>

<script>
export default {
  githubTitle: `Date range picker only show once when using customize input`,
  data() {
    return {
      date: null,
    };
  },
};
</script>
