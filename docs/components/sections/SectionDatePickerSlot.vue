<template>
<section class='section'>
  <div class='container'>
    <h4 class='title is-4 has-text-grey-dark is-spaced'>Custom Slot</h4>
    <div class='columns is-desktop'>
      <div class='column is-two-thirds'>
        <b-tabs>
          <b-tab-item label='Overview'>
            <div class='content'>
              <p>The date picker component provides some options for customizing the input element via the <code>input-class</code>, <code>input-style</code> and <code>input-placeholder</code> props.</p>
              <p>However, this may not provide enough flexibility for your application. For example, you may want to use something else to trigger the date picker popover, such as an image or custom component that wraps an input element.</p>
              <p>To use your own custom slot...</p>
              <ol>
                <li>Nest the <code>&lt;template scope='props'&gt;...&lt;/template&gt;</code> element within the <code>v-date-picker</code> component.</li>
                <li>Bind <code>props.inputValue</code> to your input value, if needed.</li>
                <li>Use <code>props.parseValue(<span style='font-style:italic'>[input value here]</span>)</code> to help parse your input value whenever needed (input blur, enter key, button action, etc).</li>
              </ol>
            </div>
            <b-message type='is-info'>
              <strong>Note:</strong> By default, <code>v-date-picker</code> will manage popover visibility for you with <code>popover-visibility</code> set to auto (<code>-1</code>).
              If you want to manage it yourself, set <code>popover-visibility</code> to visible (<code>1</code>) or hidden (<code>0</code>) within your template.
            </b-message>
          </b-tab-item>
          <b-tab-item label='Example Code'>
            <pre v-highlight><code class='html'>{{ exDatePickerSlotCode }}</code></pre>
            <br />
            <b-message type='is-info' has-icon>
              Reference <a href='https://buefy.github.io/#/documentation/input' target='_blank'>Buefy</a> for component references.
            </b-message>
          </b-tab-item>
        </b-tabs>
      </div>
      <div class='column is-one-third'>
        <ex-date-picker-slot></ex-date-picker-slot>
      </div>
    </div>
  </div>
</section>
</template>

<script>
import ExDatePickerSlot from '../examples/ExDatePickerSlot';
import ExDatePickerSlotCode from '!!raw-loader!../examples/ExDatePickerSlot';

export default {
  components: {
    ExDatePickerSlot,
  },
  data() {
    return {
      exDatePickerSlotCode: ExDatePickerSlotCode,
    };
  },
};
</script>
