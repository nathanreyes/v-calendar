<template>
  <v-date-picker
    v-model="date"
    mode="dateTime"
    :minute-increment="5"
    :popover="{ visibility: 'focus' }"
  >
    <template v-slot="{ inputValue, inputEvents, togglePopover }">
      <slot v-bind="{ inputValue, inputEvents, togglePopover }">
        <input :value="inputValue" v-on="inputEvents" />
      </slot>
    </template>
  </v-date-picker>
</template>

<script>
export default {
  githubTitle: 'Fix error binding v-model when using TimeSelect',
  data() {
    return {
      date: new Date(2021, 8, 28, 18, 5),
    };
  },
};
</script>
