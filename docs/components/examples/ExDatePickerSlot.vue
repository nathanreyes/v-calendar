<template>
<v-date-picker
  select-mode='single'
  v-model='selectedValue'
  :popover-visibility='popoverVisibility'>
  <template scope='props'>
    <b-field :type='inputState.type'>
      <p class='control'>
        <a
          :class='["button", inputState.type, { "is-outlined": popoverVisibility === 1 }]'
          @click='togglePopover'>
          <b-icon icon='calendar' size='is-small'></b-icon>
        </a>
      </p>
      <b-input
        :value='props.inputValue'
        :placeholder='inputState.message'
        @keyup.native.enter='selectedValue = props.parseValue($event.target.value)'>
      </b-input>
      <p
        class='control'
        v-if='props.inputValue !== ""'>
        <a
          :class='["button", inputState.type]'
          @click='selectedValue = null'>Clear</a>
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
      valueText: '',
      popoverVisibility: 0, // 0: Hidden, 1: Visible, -1: Auto (Default)
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
  methods: {
    togglePopover() {
      this.popoverVisibility = (this.popoverVisibility ? 0 : 1);
    },
  },
};
</script>
