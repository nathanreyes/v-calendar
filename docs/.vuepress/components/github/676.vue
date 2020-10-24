<template>
  <div class="flex flex-col items-center">
    <v-calendar :attributes="attrs" :from-page="fromPage"></v-calendar>
    <input type="number" v-model.number="year" min="1900" max="3000" />
    <input type="number" v-model.number="month" min="1" max="12" />
  </div>
</template>

<script>
import timezones from '../../../../tests/timezones';
import { padStart, orderBy } from 'lodash';

export default {
  githubTitle: "Certain dates can't be highlighted",
  data() {
    return {
      year: 1988,
      month: 10,
    };
  },
  computed: {
    attrs: function() {
      return [
        {
          dates: this.dates,
          dot: true,
        },
        {
          dates: new Date(this.year, this.month - 1, 30),
          highlight: true,
        },
      ];
    },
    fromPage: function() {
      return {
        year: this.year,
        month: this.month,
      };
    },
    dates: function() {
      let dates = [];

      for (let i = 1; i < 32; i++) {
        dates.push(new Date(this.year, this.month - 1, i));
      }
      return dates;
    },
  },
  methods: {
    clear() {
      this.date = '';
      this.range = null;
    },
  },
};
</script>
