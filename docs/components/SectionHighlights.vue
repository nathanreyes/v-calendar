<template>
<section id='highlights' class='section'>
  <div class='container'>
    <h4 class='title is-4 has-text-grey-dark is-spaced'>Highlights</h4>
    <div class='columns'>
      <!--Highlights Overview/Example Code-->
      <div class='column is-one-half'>
        <b-tabs>
          <!--Highlights Overview-->
          <b-tab-item label='Overview'>
            <div class='content'>
              <ul>
                <li>Support for custom background, border and content</li>
                <li>Spans dates and date ranges</li>
                <li>Optionally animated on appearance or disappearance</li> 
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
      <div class='column is-one-half is-example'>
        <ex-highlights></ex-highlights>
      </div>
    </div>
  </div>
</section>
</template>

<script>
/* eslint-disable import/no-webpack-loader-syntax */
/* eslint-disable import/no-duplicates */
/* eslint-disable import/first */
import ExHighlights from './ExHighlights';
import ExHighlightsCode from '!!raw-loader!./ExHighlights';

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
