<template>
<section id='example-1' class='section'>
  <div class='container'>
    <article class='media'>
      <div class='media-left'>
        <p class='title is-5'>1</p>
      </div>
      <div class='media-content'>
        <p class='title is-5'>Styled header and weekday sections</p>
      </div>
    </article>
    <br />
    <div class='columns is-desktop'>
      <div class='column'>
        <code-block :code='exStyling1Code'></code-block>
      </div>
      <div class='column'>
        <ex-styling-1></ex-styling-1>
      </div>
    </div>
  </div>
</section>
</template>

<script>
import ExStyling1 from '../examples/ExStyling-1';
import ExStyling1Code from '!!raw-loader!../examples/ExStyling-1';

export default {
  components: {
    ExStyling1,
  },
  data() {
    return {
      exStyling1Code: ExStyling1Code,
    };
  },
};
</script>