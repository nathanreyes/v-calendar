<template>
  <section id='intro' class='section'>
    <div class='container'>
      <h3 class='title has-text-primary is-spaced'>Calendar</h3>
      <div class='columns'>
        <div class='column is-one-half'>
          <b-tabs>
            <!--Intro Overview-->
            <b-tab-item label='Overview'>
              <div class='content'>
                <p>
                  V-Calendar is a lightweight and dependency free plugin for Vue.js used to display simple calendars for web applications.
                </p>
                <p>
                  It was designed from the outset with extendability and customization in mind.
                  However, it also has some pretty neat built-in ways to communicate information to your users through the use of attributes.
                </p>
              </div>
            </b-tab-item>
            <!--Intro Example Code-->
            <b-tab-item label='Example Code'>
              <pre v-highlight><code class='html'>{{ exIntroCode }}</code></pre>
            </b-tab-item>
          </b-tabs>
        </div>
        <div class='column is-one-half is-example'>
          <ex-intro>
          </ex-intro>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
/* eslint-disable import/no-webpack-loader-syntax */
/* eslint-disable import/no-duplicates */
/* eslint-disable import/first */
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
