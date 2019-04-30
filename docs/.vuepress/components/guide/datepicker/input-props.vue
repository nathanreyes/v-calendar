<template>
  <div class="example">
    <v-date-picker
      v-model="date"
      class="w-64"
      :input-props="{
        class: 'w-full shadow appearance-none border rounded py-2 px-3 text-gray-700 focus:border-blue-4',
        placeholder: 'Please enter your birthday',
        readonly: true
      }"
    />
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