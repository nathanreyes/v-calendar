<template>
  <div>
    <v-date-picker
      v-model="date"
      :popover="{
        placement: 'bottom',
        visibility: 'click',
      }"
      :input-props="{
        class: 'form-control bg-white border-left-0',
        placeholder: 'Select a date',
        readonly: true,
      }"
    />
  </div>
</template>

<script>
export default {
  githubTitle: `Date picker not closing when clicking off of calendar`,
  data() {
    return {
      date: new Date(),
    };
  },
};
</script>
