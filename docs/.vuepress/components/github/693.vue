<template>
  <div>
    <v-date-picker :popover="popover" v-model="date">
      <template #default="{ inputValue, inputEvents }">
        <input :value="inputValue" v-on="inputEvents" />
      </template>
    </v-date-picker>
  </div>
</template>

<script>
export default {
  data() {
    return {
      date: new Date(),
      popover: {
        placement: 'bottom',
        visibility: 'click',
      },
    };
  },
};
</script>