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
        <div class='content'>
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
              <div class='calendar-container'>
                <calendar
                  :symbols='calendarSymbols'>
                </calendar>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import Calendar from './Calendar';

export default {
  components: {
    Calendar,
  },
  name: 'hello',
  data() {
    return {
      msg: 'Welcome to Your Vue.js App',
      calendarSymbols: [
        {
          theme: {
            background: {
              horizontalAlign: 'center',
              verticalAlign: 'center',
              class: null,
              style: {
                backgroundColor: 'red',
                borderRadius: '50%',
                width: '1.9em',
                height: '1.9em',
              },
              animation: 'none',
            },
            content: {
              horizontalAlign: 'center',
              verticalAlign: 'center',
            },
          },
          date: new Date(2017, 7, 30),
        },
      ],
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='sass' scoped>

.calendar-container
  display: flex
  justify-content: center

</style>
