<template>
<section id='highlights' class='section'>
  <div class='container'>
    <h4 class='title is-4 has-text-grey-dark is-spaced'>Highlights</h4>
    <div class='columns is-desktop'>
      <!--Highlights Overview/Example Code-->
      <div class='column'>
        <b-tabs>
          <!--Highlights Overview-->
          <b-tab-item label='Overview'>
            <div class='content'>
              <ul>
                <li>Custom background and border properties</li>
                <li>Smart layering for overlapping dates</li>
                <li>Optionally animated on appearance or disappearance</li> 
                <li>Use content styles to properly display day content</li>
              </ul>
            </div>
          </b-tab-item>
          <!--Highlights Example Code-->
          <b-tab-item label='Example Code'>
            <pre v-highlight><code class='html'>{{ exHighlightsCode }}</code></pre>
          </b-tab-item>
        </b-tabs>
      </div>
      <!--Highlights Example-->
      <div class='column'>
        <div class='example-container'>
          <ex-highlights></ex-highlights>
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
import ExHighlights from '../examples/ExHighlights';
import ExHighlightsCode from '!!raw-loader!../examples/ExHighlights';

export default {
  components: {
    ExHighlights,
  },
  data() {
    return {
      exHighlightsCode: ExHighlightsCode,
    };
  },
};
</script>
