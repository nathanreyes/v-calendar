<template>
<v-date-picker
  select-mode='single'
  v-model='selectedValue'>
  <template scope='props'>
    <b-field :type='inputState.type'>
      <b-input
        icon='calendar'
        :value='props.inputValue'
        :placeholder='inputState.message'
        @keyup.native.enter='selectedValue = props.parseValue($event.target.value)'
        @blur='selectedValue = props.parseValue($event.target.value)'>
      </b-input>
      <p
        class='control'
        v-if='selectedValue'>
        <a
          :class='["button", inputState.type]'
          @click='selectedValue = null'>
          Clear
        </a>
      </p>
    </b-field>
  </template>
</v-date-picker>
</template>

<script>
export default {
  data() {
    return {
      selectedValue: null,
    };
  },
  computed: {
    inputState() {
      if (!this.selectedValue) {
        return {
          type: 'is-danger',
          message: 'Date required.',
        };
      }
      return {
        type: 'is-primary',
        message: '',
      };
    },
  },
};
</script>
