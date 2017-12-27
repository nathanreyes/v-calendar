<template>
<section id='indicators' class='section'>
  <h3 class='title has-text-primary is-spaced'>Dots</h3>
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
  <h4 class='title is-4 has-text-grey-dark is-spaced'>API</h4>
  <table-dot></table-dot>
</section>
</template>

<script>
import ExDots from '../examples/ExDots';
import ExDotsCode from '!!raw-loader!../examples/ExDots';
import TableDot from '../tables/TableDot';

export default {
  components: {
    ExDots,
    TableDot,
  },
  data() {
    return {
      exDotsCode: ExDotsCode,
    };
  },
};
</script>
