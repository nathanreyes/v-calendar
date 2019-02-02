<template>
  <div class='example'>
    <v-date-picker
      v-model='date'
      class='flex-grow'
      :input-props='{
        class: "w-full shadow appearance-none border rounded py-2 px-3 text-grey-darker focus:border-blue-light",
        placeholder: "Please enter your birthday",
        readonly: true
      }'>
    </v-date-picker>
  </div>
</template>

<script>
export default {
  data() {
    return {
      date: null,
    };
  },
};
</script>