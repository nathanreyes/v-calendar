<template>
<section id='indicators' class='section'>
  <div class='container'>
    <h4 class='title is-4 has-text-grey-dark is-spaced'>Dots</h4>
    <div class='columns is-desktop'>
      <div class='column'>
        <b-tabs>
          <!--Dots Overview-->
          <b-tab-item label='Overview'>
            <div class='content'>
              <ul>
                <li>Custom color, border and size properties</li>
                <li>Supports single dates and date ranges</li>
                <li>Custom style support for dots container</li>
              </ul>
            </div>
          </b-tab-item>
          <!--Dots Example Code-->
          <b-tab-item label='Example Code'>
            <code-block :code='exDotsCode'></code-block>
          </b-tab-item>
        </b-tabs>
      </div>
      <div class='column'>
        <div class='example-container'>
          <ex-dots></ex-dots>
        </div>
      </div>
    </div>
  </div>
</section>
</template>

<script>
import ExDots from '../examples/ExDots';
import ExDotsCode from '!!raw-loader!../examples/ExDots';

export default {
  components: {
    ExDots,
  },
  data() {
    return {
      exDotsCode: ExDotsCode,
    };
  },
};
</script>
