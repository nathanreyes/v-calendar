<template>
<section id='indicators' class='section'>
  <div class='container'>
    <h4 class='title is-4 has-text-grey-dark is-spaced'>Indicators</h4>
    <div class='columns'>
      <div class='column is-one-half'>
        <b-tabs>
          <!--Indicators Overview-->
          <b-tab-item label='Overview'>
            <div class='content'>
              <p class='subtitle'></p>
              <ul>
                <li>Custom color, border and size properties</li>
                <li>Spans dates and date ranges</li>
                <li>Optionally animated on appearance or disappearance</li> 
              </ul>
            </div>
          </b-tab-item>
          <!--Indicators Example Code-->
          <b-tab-item label='Example Code'>
            <pre v-highlight><code class='html'>{{ exIndicatorsCode }}</code></pre>
          </b-tab-item>
        </b-tabs>
      </div>
      <div class='column is-one-half is-example'>
        <ex-indicators></ex-indicators>
      </div>
    </div>
  </div>
</section>
</template>

<script>
/* eslint-disable import/no-webpack-loader-syntax */
/* eslint-disable import/no-duplicates */
/* eslint-disable import/first */
import ExIndicators from '../examples/ExIndicators';
import ExIndicatorsCode from '!!raw-loader!../examples/ExIndicators';

export default {
  components: {
    ExIndicators,
  },
  data() {
    return {
      exIndicatorsCode: ExIndicatorsCode,
    };
  },
};
</script>
