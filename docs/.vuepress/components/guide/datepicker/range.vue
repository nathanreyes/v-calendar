<template>
  <div class='example'>
    <v-date-picker
      :style='{ minWidth: "220px" }'
      mode='range'
      v-model='range'
      show-caps>
    </v-date-picker>
  </div>
</template>

<script>
export default {
  data() {
    return {
      range: {
        start: new Date(2018, 0, 16), // Jan 16th, 2018
        end: new Date(2018, 0, 19), // Jan 19th, 2018
      },
    };
  },
};
</script>

