<template>
  <div class="example">
    <v-calendar :from-date="fromDate" :attributes="attrs"></v-calendar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fromDate: new Date(2018, 0, 1),
      attrs: [
        {
          key: 'today',
          highlight: {
            backgroundColor: '#ff8080',
            // Other properties are available too, like `height` & `borderRadius`
          },
          // Just use a normal style
          contentStyle: {
            color: '#fafafa',
          },
          dates: { weekdays: [1, 7] }, // On the weekends
        },
      ],
    };
  },
};
</script>