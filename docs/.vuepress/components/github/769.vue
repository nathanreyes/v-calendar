<template>
  <v-date-picker v-model="range" is-range>
    <template v-slot="{ inputValue, inputEvents }">
      <div class="flex">
        <input
          :class="inputClass"
          :value="inputValue.start"
          v-on="inputEvents.start"
        />
        <span class="mx-2 text-lg">&rarr;</span>
        <input
          :class="inputClass"
          :value="inputValue.end"
          v-on="inputEvents.end"
        />
      </div>
    </template>
  </v-date-picker>
</template>

<script>
export default {
  githubTitle:
    'Range datepicker with double inputs disallows typing dates manually',
  data() {
    return {
      range: null,
      inputClass: 'px-2 py-1 border rounded',
    };
  },
};
</script>
