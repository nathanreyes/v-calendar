<template>
<section id='content-styles' class='section'>
  <h3 class='title has-text-primary is-spaced'>Content Styles</h3>
  <div class='columns is-desktop'>
    <!--Highlights Overview/Example Code-->
    <div class='column'>
      <b-tabs>
        <!--Highlights Overview-->
        <b-tab-item label='Overview'>
          <div class='content'>
            <ul>
              <li>Custom style objects are applied to day cell content</li>
              <li>Styles are merged for overlapping dates</li>
              <li>Support for additional styles during hovered state</li>
              <li>Provide additional context/clarity for highlights and indicators</li>
            </ul>
          </div>
        </b-tab-item>
        <!--Content Styles Example Code-->
        <b-tab-item label='Example Code'>
          <code-block :code='exContentStylesCode'></code-block>
        </b-tab-item>
      </b-tabs>
    </div>
    <!--Content Styles Example-->
    <div class='column'>
      <div class='example-container'>
        <ex-content-styles></ex-content-styles>
      </div>
    </div>
  </div>
</section>
</template>

<script>
import ExContentStyles from '../examples/ExContentStyles';
import ExContentStylesCode from '!!raw-loader!../examples/ExContentStyles';

export default {
  components: {
    ExContentStyles,
  },
  data() {
    return {
      exContentStylesCode: ExContentStylesCode,
    };
  },
};
</script>
