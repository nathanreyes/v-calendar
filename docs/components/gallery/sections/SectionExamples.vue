<template>
<section id='examples' class='section'>
  <div class='container'>
    <h3 class='title has-text-primary is-spaced'>Gallery</h3>
    <b-message type='is-warning'>
      <strong>Note:</strong> This page is currently in work.
    </b-message>
    <div
      class='example'
      v-for='(example, i) in examples'
      :key='i + 1'>
      <article class='media'>
        <div class='media-left'>
          <p class='title is-5'>{{ i + 1 }}</p>
        </div>
        <div class='media-content'>
          <p class='title is-5'>{{ example.title }}</p>
        </div>
      </article>
      <br />
      <div class='columns is-desktop'>
        <div class='column'>
          <code-block :code='example.code'></code-block>
        </div>
        <div class='column'>
          <div class='example-container'>
            <component :is='example.component'></component>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
</template>

<script>
import ExStyling1 from '../examples/ExStyling-1';
import ExStyling1Code from '!!raw-loader!../examples/ExStyling-1';
import ExStyling2 from '../examples/ExStyling-2';
import ExStyling2Code from '!!raw-loader!../examples/ExStyling-2';

export default {
  data() {
    return {
      examples: [
        {
          title: 'Date picker w/ styled header & weekdays',
          code: ExStyling1Code,
          component: ExStyling1,
        },
        {
          title: 'Calendar w/ styled wrapper',
          code: ExStyling2Code,
          component: ExStyling2,
        },
      ],
    };
  },
};
</script>

<style lang='sass' scoped>

.example
  margin-top: 40px

.example-container
  margin-top: 0

</style>
