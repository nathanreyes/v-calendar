<template>
  <div class="example">
    <v-calendar
      :show-weeknumbers="!iso && option"
      :show-iso-weeknumbers="iso && option"
      :first-day-of-week="iso ? 2 : undefined"
    >
      <template v-slot:weeknumber="{ weeknumber, classes }">
        <div :class="[classes, 'hover:bg-gray-300']">
          {{ weeknumber }}
        </div>
      </template>
    </v-calendar>
  </div>
</template>

<script>
export default {
  props: {
    option: {
      type: String,
      default: 'left',
    },
    iso: Boolean,
  },
};
</script>
