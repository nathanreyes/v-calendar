<template>
  <Example centered>
    <Calendar :attributes="attrs" />
  </Example>
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
