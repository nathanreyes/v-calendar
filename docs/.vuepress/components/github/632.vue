<template>
  <div class="example">
    <!-- 2.0 -->
    <v-date-picker v-model="date" :popover="popover">
      <template #default="{ inputValue, inputEvents }">
        <input :value="inputValue" v-on="inputEvents" />
      </template>
    </v-date-picker>
  </div>
</template>
<script>
export default {
  githubTitle: 'No easy way to fully disable Date Picker',
  data() {
    return {
      date: new Date(),
      disabled: true,
    };
  },
  computed: {
    popover() {
      return {
        visibility: this.disabled ? 'hidden' : 'hover-focus',
      };
    },
  },
};
</script>
