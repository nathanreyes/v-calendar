<template>
<section id='popovers' class='section'>
  <div class='container'>
    <h4 class='title is-4 has-text-grey-dark is-spaced'>Popovers</h4>
    <div class='columns is-desktop'>
      <!--Popovers Overview/Example Code-->
      <div class='column'>
        <b-tabs>
          <!--Popovers Overview-->
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
  </div>
</section>
</template>

<script>
import ExPopovers from '../examples/ExPopovers';
import ExPopoversCode from '!!raw-loader!../examples/ExPopovers';

export default {
  components: {
    ExPopovers,
  },
  data() {
    return {
      exPopoversCode: ExPopoversCode,
    };
  },
};
</script>
