<template>
<section id='date-patterns' class='section'>
  <h3 class='title has-text-primary is-spaced'>Date Patterns</h3>
  <div class='columns is-desktop'>
    <div class='column'>
      <b-tabs>
        <!--Date Patterns Overview-->
        <b-tab-item label='Overview'>
          <div class='content'>
            <p>
              Date patterns allow for more flexible styling and can even be used to add robust features for your web applications. Here are a few benefits they provide:
            </p>
            <ul>
              <li>Created by adding conditions to date ranges</li>
              <li>Uses a declarative, serializable syntax</li>
              <li>Up to 10 differents types of supported patterns</li>
              <li>Combine pattern sets together for complex applications</li>
              <li>Supports custom date functions for more flexibility</li>
            </ul>
          </div>
        </b-tab-item>
        <!--Date Patterns Example Code-->
        <b-tab-item label='Example Code'>
          <code-block :code='exDatePatternsCode'></code-block>
        </b-tab-item>
        <!--Date Patterns Options-->
        <b-tab-item label='Options' icon='gear'>
          <p class='content'>
            Reference the pattern table below for valid patterns. Nest multiple patterns in an array assigned to the <code>on</code> property to conditionally <i>OR</i> them together.
          </p>
          <b-field
            label='Enter your own patterns'
            :type='patternStatus'
            :message='patternMessage'>
            <b-input
              type='textarea'
              rows='8'
              :value='patternFormattedText'
              @input='patternText = $event'>
            </b-input>
          </b-field>
        </b-tab-item>
      </b-tabs>
    </div>
    <div class='column'>
      <div class='example-container'>
        <ex-date-patterns
          :patterns='patterns'>
        </ex-date-patterns>
      </div>
    </div>
  </div>
  <h4 class='title is-4 has-text-grey-dark is-spaced'>API</h4>
  <table-date-patterns></table-date-patterns>
</section>
</template>

<script>
import ExDatePatterns from '../examples/ExDatePatterns';
import ExDatePatternsCode from '!!raw-loader!../examples/ExDatePatterns';
import TableDatePatterns from '../tables/TableDatePatterns';

export default {
  components: {
    ExDatePatterns,
    TableDatePatterns,
  },
  data() {
    return {
      exDatePatternsCode: ExDatePatternsCode,
      patternStatus: '',
      patternMessage: '',
      patternText: `
      {
        weeklyInterval: 2,
        weekdays: [7, 4]
      }
      `,
    };
  },
  computed: {
    patternFormattedText() {
      return this.$options.filters.pre(this.patternText);
    },
    patterns() {
      let patterns = {};
      try {
        patterns = JSON.parse(this.patternFormattedText.replace(/(['"])?([a-z0-9A-Z_]+)(['"])?:/g, '"$2": '));
        this.patternMessage = '';
        this.patternStatus = '';
      } catch (e) {
        this.patternMessage = e.message;
        this.patternStatus = 'is-danger';
      }
      return patterns;
    },
  },
};
</script>