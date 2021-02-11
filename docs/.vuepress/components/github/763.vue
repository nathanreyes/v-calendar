<template>
  <div>
    <div class="mb-4" v-if="false">
      <v-date-picker
        class="flex items-center"
        v-model="range"
        :input-selectors="['.start input', '.end input']"
        is-range
      >
        <custom-input class="start" /> &rarr; <custom-input class="end" />
      </v-date-picker>
    </div>
    <div>
      <v-date-picker v-model="date" input-selectors="input">
        <custom-input />
      </v-date-picker>
    </div>
  </div>
</template>

<script>
import CustomInput from '../util/custom-input';

export default {
  githubTitle: `Custom input slot bindings don't work on inputEvents (by default)`,
  components: {
    CustomInput,
  },
  data() {
    return {
      date: new Date(),
      range: { start: new Date(), end: new Date() },
    };
  },
};
</script>
