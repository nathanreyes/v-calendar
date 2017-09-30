<template>
<section id='content-styles' class='section'>
  <div class='container'>
    <h4 class='title is-4 has-text-grey-dark is-spaced'>Content Styles</h4>
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
          <!--Content Styles Example Code-->
          <b-tab-item label='Example Code'>
            <pre v-highlight><code class='html'>{{ exContentStylesCode }}</code></pre>
          </b-tab-item>
        </b-tabs>
      </div>
      <!--Content Styles Example-->
      <div class='column is-one-half is-example'>
        <ex-content-styles></ex-content-styles>
      </div>
    </div>
  </div>
</section>
</template>

<script>
/* eslint-disable import/no-webpack-loader-syntax */
/* eslint-disable import/no-duplicates */
/* eslint-disable import/first */
import ExContentStyles from './ExContentStyles';
import ExContentStylesCode from '!!raw-loader!./ExContentStyles';

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
