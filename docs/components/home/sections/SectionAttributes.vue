<template>
<section id='attributes' class='section'>
  <h3 class='title has-text-primary is-spaced'>Attributes</h3>
  <div class='columns is-desktop'>
    <div class='column'>
      <b-tabs>
        <!--Attributes Overview-->
        <b-tab-item label='Overview'>
          <div class='content'>
            <p>Attributes are used to decorate the calendar with the following objects:</p>
            <ul>
              <li>highlights</li>
              <li>dot indicators</li>
              <li>bar indicators</li>
              <li>popovers <b-tag type='is-success'>New!</b-tag></li>
              <li>content styles</li>
              <li>content hover styles</li>
            </ul>
            <p>A single attribute may include one of each. To specify which days you would like to apply an attribute to, use single dates, date ranges or even complex date patterns like the following:</p>
            <ul>
              <li>Every other Friday</li>
              <li>1st and the 15th of every month</li>
              <li>Last Saturday of the month</li>
              <li>Every year on January 21st (...oh hey my birthday)</li>
            </ul>
          </div>
        </b-tab-item>
        <!--Attributes Example Code-->
        <b-tab-item label='Example Code'>
          <code-block :code='exAttributesCode'></code-block>
        </b-tab-item>
      </b-tabs>
    </div>
    <!--Attributes Example-->
    <div class='column'>
      <div class='example-container'>
        <ex-attributes></ex-attributes>
      </div>
    </div>
  </div>
  <h4 class='title is-4 has-text-grey-dark is-spaced'>API</h4>
  <table-attribute></table-attribute>
</section>
</template>

<script>
import ExAttributes from '../examples/ExAttributes';
import ExAttributesCode from '!!raw-loader!../examples/ExAttributes';
import TableAttribute from '../tables/TableAttribute';

export default {
  components: {
    ExAttributes,
    TableAttribute,
  },
  data() {
    return {
      exAttributesCode: ExAttributesCode,
    };
  },
};
</script>

<style lang='sass' scoped>

.attribute-img
  max-height: 300px
  margin-top: -30px

/deep/ .tag
  margin-left: 10px
  
</style>