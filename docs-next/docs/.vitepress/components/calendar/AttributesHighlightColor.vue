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
          highlight: 'red',
          dates: new Date(),
        },
      ],
    };
  },
};
</script>
