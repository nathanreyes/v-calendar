<template>
  <VCalendar :attributes="attrs" />
</template>

<script>
export default {
  data() {
    return {
      attrs: [
        {
          key: 'today',
          highlight: 'red',
          dates: new Date(),
        },
      ],
    };
  },
};
</script>
