<template>
<section id='indicators' class='section'>
  <h3 class='title has-text-primary is-spaced'>Bars</h3>
  <div class='columns is-desktop'>
    <div class='column'>
      <b-tabs>
        <!--Bars Overview-->
        <b-tab-item label='Overview'>
          <div class='content'>
            <ul>
              <li>Custom color, border and size properties</li>
              <li>Support single dates and date ranges</li>
              <li>Custom style support for bars container</li>
            </ul>
          </div>
        </b-tab-item>
        <!--Bars Example Code-->
        <b-tab-item label='Example Code'>
          <code-block :code='exBarsCode'></code-block>
        </b-tab-item>
      </b-tabs>
    </div>
    <div class='column'>
      <div class='example-container'>
        <ex-bars></ex-bars>
      </div>
    </div>
  </div>
  <h4 class='title is-4 has-text-grey-dark is-spaced'>API</h4>
  <table-bar></table-bar>
</section>
</template>

<script>
import ExBars from '../examples/ExBars';
import ExBarsCode from '!!raw-loader!../examples/ExBars';
import TableBar from '../tables/TableBar';

export default {
  components: {
    ExBars,
    TableBar,
  },
  data() {
    return {
      exBarsCode: ExBarsCode,
    };
  },
};
</script>
