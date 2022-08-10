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
          highlight: true,
          dates: new Date(),
        },
      ],
    };
  },
};
</script>
