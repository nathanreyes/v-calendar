<template>
  <v-popover
    class='popover'
    :content-offset='contentOffset'
    :visibility='visibility'
    :direction='direction'
    :align='align'
    is-expanded>
    <b-field label='Password'>
      <b-input
        type='password'
        :value='password'
        pattern='.{6,}'
        title='Minimum of '
        required
        password-reveal>
      </b-input>
    </b-field>
    <div slot='popover-content'>
      This is the custom popover content.
    </div>
  </v-popover>
</template>

<script>

export default {
  props: {
    isExpanded: Boolean,
    contentOffset: { type: String, default: '10px' },
    visibility: { type: String, default: 'visible' },
    direction: { type: String, default: 'bottom' },
    align: { type: String, default: 'left' },
  },
  data() {
    return {
      password: '',
    };
  },
};
</script>

<style lang='sass' scoped>
.popover
  width: 200px
</style>
