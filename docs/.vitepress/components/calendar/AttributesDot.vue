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
          dot: true,
          dates: new Date(),
        },
      ],
    };
  },
};
</script>
