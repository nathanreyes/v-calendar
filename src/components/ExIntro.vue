<template>
<div>
  <b-field>
    <b-switch v-model='isDoublePaned'>Double-Paned</b-switch>
  </b-field>
  <b-field label='Title Transition'>
    <b-select
      placeholder='Title Transition'
      v-model='titleTransition'>
      <option
        v-for="transition in transitions"
        :value="transition"
        :key="transition">
        {{ transition }}
      </option>
    </b-select>
  </b-field>
  <b-field label='Weeks Transition'>
    <b-select
      placeholder='Weeks Transition'
      v-model='weeksTransition'>
      <option
        v-for="transition in transitions"
        :value="transition"
        :key="transition">
        {{ transition }}
      </option>
    </b-select>
  </b-field>
  <calendar
    :is-double-paned='isDoublePaned'
    :title-transition='titleTransition'
    :weeks-transition='weeksTransition'>
  </calendar>
</div>
</template>

<script>
import Calendar from './lib/Calendar';

export default {
  components: {
    Calendar,
  },
  data() {
    return {
      isDoublePaned: false,
      titleTransition: 'slide',
      weeksTransition: 'slide',
      transitions: ['slide', 'fade', 'none'],
    };
  },
};
</script>
