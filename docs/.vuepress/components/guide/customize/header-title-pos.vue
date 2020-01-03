<template>
  <div>
    <div
      class='flex justify-center items-center mt-6'>
      <label
        class='flex items-center'
        for='left'>
        <input type='radio' id='left' value='left' v-model='titlePosition'>
        <span class='ml-2'>Left</span>
      </label>
      <label
        class='ml-6 flex items-center'
        for='center'>
        <input type='radio' id='center' value='center' v-model='titlePosition'>
        <span class='ml-2'>Center</span>
      </label>
      <label
        class='ml-6 flex items-center'
        for='right'>
        <input type='radio' id='right' value='right' v-model='titlePosition'>
        <span class='ml-2'>Right</span>
      </label>
    </div>
    <div class='center'>
      <v-calendar
        :title-position='titlePosition'>
      </v-calendar>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      titlePosition: 'center',
    };
  },
};
</script>
