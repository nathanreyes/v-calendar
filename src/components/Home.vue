<template>
  <div>
    <section class='hero is-primary'>
      <div class='hero-body'>
        <div class='container has-text-centered'>
          <h1 class='title'>V-Calendar</h1>
          <h2 class='subtitle'>A stylish calendar</h2>
        </div>
      </div>
      <!-- Hero footer: will stick at the bottom -->
      <div class="hero-foot">
        <nav class="tabs">
          <div class="container">
            <ul>
              <li class="is-active"><a>Overview</a></li>
              <li><a>Modifiers</a></li>
              <li><a>Grid</a></li>
              <li><a>Elements</a></li>
              <li><a>Components</a></li>
              <li><a>Layout</a></li>
            </ul>
          </div>
        </nav>
      </div>
    </section>
    <section class='section'>
      <div class='container content'>
        <h1 class='title is-spaced'>Overview</h1>
        <div class='columns'>
          <div class='column is-half'>
            <h4>
              V-Calendar is a calendar component for Vue.js. It was designed with these goals in mind.
            </h4>
            <ul>
              <li>Lightweight and dependency-free</li>
              <li>Customizable via props and scoped slots</li>
              <li>Out of the box support for highlighted backgrounds, attributes and datepickers
              <li>Clean and lively default design</li>
            </ul>
          </div>
          <div class='column is-half'>
            <div class='center-container'>
              <calendar
                :highlights='highlights'>
              </calendar>
            </div>
          </div>
        </div>
        <h1 class='title is-spaced'>Date Picker</h1>
        <div class='columns is-centered'>
          <div class='column is-half'>
            <div class='block'>
              <div class='center-container'>
                <b-field>
                  <b-radio-button v-model='selectMode' native-value='single'>Single Date</b-radio-button>
                  <b-radio-button v-model='selectMode' native-value='multiple'>Multiple Dates</b-radio-button>
                  <b-radio-button v-model='selectMode' native-value='range'>Date Range</b-radio-button>
                </b-field>
              </div>
            </div>
            <div class='center-container'>
              <date-picker :select-mode='selectMode' v-model='selectedDate'>
              </date-picker>
            </div>
          </div>
          <div class='column is-half'>

          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import Calendar from './Calendar';
import DatePicker from './DatePicker';

export default {
  components: {
    Calendar,
    DatePicker,
  },
  name: 'hello',
  data() {
    return {
      msg: 'Welcome to Your Vue.js App',
      selectMode: 'single',
      selectedDate: null,
      highlights: [
        {
          key: '',
          // date: new Date(2017, 7, 1),
          // dates: [new Date(2017, 7, 1), new Date(2017, 7, 10), new Date(2017, 7, 22), new Date(2017, 7, 31)],
          startDate: new Date(2017, 7, 1),
          endDate: new Date(2017, 7, 4),
          backgroundColor: 'red',
          color: 'white',
          // isSquared: true,
        },
      ],
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='sass' scoped>

.center-container
  display: flex
  justify-content: center

</style>
