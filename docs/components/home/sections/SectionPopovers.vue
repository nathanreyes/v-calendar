<template>
<section id='popovers' class='section'>
  <h3 class='title has-text-primary is-spaced'>Popovers</h3>
  <div class='columns is-desktop'>
    <!--Popovers Overview/Example Code-->
    <div class='column'>
      <b-tabs>
        <!--Popovers Overview-->
        <b-tab-item label='Overview'>
          <div class='content'>
            <ul>
              <li>Supports both simple toolips and custom slot content</li>
              <li>Makes inline editing possible for custom data</li>
              <li>Optionally animated on appearance or disappearance</li> 
              <li>Use content styles to properly display day content</li>
            </ul>
          </div>
        </b-tab-item>
        <!--Popovers Example Code-->
        <b-tab-item label='Example Code'>
          <code-block :code='exPopoversCode'></code-block>
        </b-tab-item>
      </b-tabs>
    </div>
    <!--Popovers Example-->
    <div class='column'>
      <div class='example-container'>
        <ex-popovers></ex-popovers>
      </div>
    </div>
  </div>
  <h4 class='title is-4 has-text-grey-dark is-spaced'>API</h4>
  <table-popover></table-popover>
</section>
</template>

<script>
import ExPopovers from '../examples/ExPopovers';
import ExPopoversCode from '!!raw-loader!../examples/ExPopovers';
import TablePopover from '../tables/TablePopover';

export default {
  components: {
    ExPopovers,
    TablePopover,
  },
  data() {
    return {
      exPopoversCode: ExPopoversCode,
    };
  },
};
</script>
