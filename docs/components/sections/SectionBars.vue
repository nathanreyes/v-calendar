<template>
<section id='indicators' class='section'>
  <div class='container'>
    <h4 class='title is-4 has-text-grey-dark is-spaced'>Bars</h4>
    <div class='columns is-desktop'>
      <div class='column'>
        <b-tabs>
          <!--Bars Overview-->
          <b-tab-item label='Overview'>
            <div class='content'>
              <ul>
                <li>Custom color, border and size properties</li>
                <li>Assignable bottom margin for indicator row</li>
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
  </div>
</section>
</template>

<script>
import ExBars from '../examples/ExBars';
import ExBarsCode from '!!raw-loader!../examples/ExBars';

export default {
  components: {
    ExBars,
  },
  data() {
    return {
      exBarsCode: ExBarsCode,
    };
  },
};
</script>
