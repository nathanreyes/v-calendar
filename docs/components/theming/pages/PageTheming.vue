<template>
<div>
  <section-intro></section-intro>
  <section-styles></section-styles>
  <section-examples></section-examples>
</div>
</template>

<script>
import SectionIntro from '../sections/SectionIntro';
import SectionStyles from '../sections/SectionStyles';
import SectionExamples from '../sections/SectionExamples';

export default {
  components: {
    SectionIntro,
    SectionStyles,
    SectionExamples,
  },
};
</script>
