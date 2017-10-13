<template>
  <section id='intro' class='section'>
    <div class='container'>
      <h3 class='title has-text-primary is-spaced'>Calendar</h3>
      <div class='columns is-desktop'>
        <div class='column'>
          <b-tabs>
            <!--Intro Overview-->
            <b-tab-item label='Overview'>
              <div class='content'>
                <p>
                  V-Calendar is a lightweight and dependency-free Vue.js plugin for displaying simple annotated calendars.
                </p>
                <p>
                  It was designed from the outset with extendability and customization in mind.
                  However, it also has some neat built-in ways to communicate information to your users through the use of attributes.
                </p>
                <p>
                  Of course, V-Calendar is responsive and mobile friendly. It even responds to taps for day selection and touch swipes for navigation.
                </p>
              </div>
            </b-tab-item>
            <!--Intro Example Code-->
            <b-tab-item label='Example Code'>
              <pre v-highlight><code class='html'>{{ exIntroCode }}</code></pre>
            </b-tab-item>
          </b-tabs>
        </div>
        <div class='column'>
          <div class='example-container'>
            <ex-intro>
            </ex-intro>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import ExIntro from '../examples/ExIntro';
import ExIntroCode from '!!raw-loader!../examples/ExIntro';

export default {
  components: {
    ExIntro,
  },
  props: {
  },
  data() {
    return {
      exIntroCode: ExIntroCode,
      isDoublePaned: false,
      titleTransition: 'slide',
      weeksTransition: 'slide',
      transitions: ['slide', 'fade', 'none'],
    };
  },
};
</script>
