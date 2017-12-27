<template>
<section id='highlights' class='section'>
  <h3 class='title has-text-primary is-spaced'>Highlights</h3>
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
          <code-block :code='exHighlightsCode'></code-block>
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
  <h4 class='title is-4 has-text-grey-dark is-spaced'>API</h4>
  <table-highlight></table-highlight>
</section>
</template>

<script>
import ExHighlights from '../examples/ExHighlights';
import ExHighlightsCode from '!!raw-loader!../examples/ExHighlights';
import TableHighlight from '../tables/TableHighlight';

export default {
  components: {
    ExHighlights,
    TableHighlight,
  },
  data() {
    return {
      exHighlightsCode: ExHighlightsCode,
    };
  },
};
</script>
