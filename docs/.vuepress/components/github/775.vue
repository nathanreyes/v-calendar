<template>
  <form ref="form">
    <v-date-picker v-model="range" mode="dateTime" is-range is24hr>
      <template v-slot="{ inputValue, inputEvents }">
        <div class="flex justify-center items-center w-full">
          <!-- <p>{{ item.fieldChName + '：' }}</p> -->
          <input
            :value="inputValue.start"
            v-on="inputEvents.start"
            class="border px-2 py-1 w-48 rounded focus:outline-none focus:border-indigo-300"
          />
          -
          <input
            :value="inputValue.end"
            v-on="inputEvents.end"
            class="border px-2 py-1 w-48 rounded focus:outline-none focus:border-indigo-300"
          />
        </div>
      </template>
    </v-date-picker>
    <button role="button" @click.prevent="clearForm">Clear</button>
  </form>
</template>

<script>
export default {
  githubTitle: 'vuetify this.$refs.form.reset() can not reset the range inputs',
  data() {
    return {
      range: {
        start: new Date(2021, 2, 1),
        end: new Date(2021, 1, 5),
      },
    };
  },
  methods: {
    clearForm() {
      this.$refs.form.reset();
    },
  },
};
</script>
