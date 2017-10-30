<template>
<div>
  <section-styling
    v-for='(example, i) in examples'
    :key='i'
    :step='i + 1'
    :title='example.title'
    :code='example.code'>
    <component :is='example.component'></component>
  </section-styling>
</div>
</template>

<script>
import ExStyling1 from '../examples/ExStyling-1';
import ExStyling1Code from '!!raw-loader!../examples/ExStyling-1';
import ExStyling2 from '../examples/ExStyling-2';
import ExStyling2Code from '!!raw-loader!../examples/ExStyling-2';

import SectionStyling from '../sections/SectionStyling';

export default {
  components: {
    SectionStyling,
  },
  data() {
    return {
      examples: [
        {
          title: 'Styled Header & Weekday Sections',
          code: ExStyling1Code,
          component: ExStyling1,
        },
        {
          title: 'Example 2',
          code: ExStyling2Code,
          component: ExStyling2,
        },
      ],
    };
  },
};
</script>