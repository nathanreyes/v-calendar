<template>
<section id='api' class='section'>
  <h4 class='title is-4 has-text-grey-dark is-spaced'>API</h4>
  <b-tabs>
    <b-tab-item label='Props'>
      <b-message type='is-info'>
        <strong>Note:</strong> <code>v-date-picker</code> accepts all props supported by <code>v-calendar</code>.
        API below is specific to <code>v-date-picker</code> only.
      </b-message>
      <table-date-picker-props></table-date-picker-props>
    </b-tab-item>
    <b-tab-item label='Events'>
      <b-message type='is-info'>
        <strong>Note:</strong> <code>v-date-picker</code> forwards all events emitted by <code>v-calendar</code>.
        API below is specific to <code>v-date-picker</code> only.
      </b-message>
      <table-date-picker-events></table-date-picker-events>
    </b-tab-item>
    <b-tab-item label='Slots'>
      <table-date-picker-slots></table-date-picker-slots>
    </b-tab-item>
  </b-tabs>
</section>
</template>

<script>
import TableDatePickerProps from '../tables/TableDatePickerProps';
import TableDatePickerEvents from '../tables/TableDatePickerEvents';
import TableDatePickerSlots from '../tables/TableDatePickerSlots';

export default {
  components: {
    TableDatePickerProps,
    TableDatePickerEvents,
    TableDatePickerSlots,
  },
};
</script>