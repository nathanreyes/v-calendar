<template>
<section id='content-styles' class='section'>
  <div class='container'>
    <h4 class='title is-4 has-text-grey-dark is-spaced'>Content Styles</h4>
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
            <pre v-highlight><code class='html'>{{ exContentStylesCode }}</code></pre>
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
  </div>
</section>
</template>

<script>
/* eslint-disable import/no-webpack-loader-syntax */
/* eslint-disable import/no-duplicates */
/* eslint-disable import/first */
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
