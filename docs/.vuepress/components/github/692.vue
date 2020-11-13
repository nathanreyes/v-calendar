<template>
  <div class="container">
    <v-calendar :attributes="attributes" />
    <v-date-picker :popover="popover" v-model="date">
      <template #default="{ inputValue, inputEvents }">
        <input :value="inputValue" v-on="inputEvents" />
      </template>
    </v-date-picker>
  </div>
</template>

<script>
export default {
  githubTitle: '"Delay" when opening/closing',
  data() {
    return {
      date: new Date(),
      popover: {
        showDelay: 0,
        hideDelay: 100,
        transition: 'none',
      },
      attributes: [
        {
          highlight: true,
          dates: [new Date(), new Date(2020, 10, 13)],
          popover: {
            label: 'hi',
            hideDelay: 100,
            transition: 'fade',
            visibility: 'hover',
          },
        },
      ],
    };
  },
};
</script>
