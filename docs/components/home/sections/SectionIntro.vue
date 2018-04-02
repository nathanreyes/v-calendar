<template>
<section id='intro' class='section'>
  <h3 class='title has-text-primary is-spaced'>Calendar</h3>
  <div class='columns is-desktop'>
    <div class='column'>
      <b-tabs>
        <!--Intro Overview-->
        <b-tab-item label='Overview'>
          <div class='content'>
            <p>
              V-Calendar is a clean and lightweight Vue.js plugin for displaying simple, annotated calendars.
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
        <!--Intro Options-->
        <b-tab-item label='Options' icon='gear'>
          <b-field grouped>
            <b-field>
              <b-switch v-model='isDoublePaned'>Double Paned</b-switch>
            </b-field>
            <b-field>
              <b-switch v-model='isLinked'>Linked</b-switch>
            </b-field>
            <b-field>
              <b-switch v-model='isVertical'>Vertical</b-switch>
            </b-field>
            <b-field>
              <b-switch v-model='isExpanded'>Expanded</b-switch>
            </b-field>
          </b-field>
          <b-field label='Navigation Visibility'>
            <p class='control-offset'>
              <b-radio
                v-for='v in navVisibilities'
                :key='v'
                :native-value='v'
                v-model='navVisibility'>
                {{ v }}
              </b-radio>
            </p>
          </b-field>
          <b-field label='Title Position'>
            <p class='control'>
              <b-radio v-model='titlePosition' native-value='left'>Left</b-radio>
              <b-radio v-model='titlePosition' native-value='center'>Center</b-radio>
              <b-radio v-model='titlePosition' native-value='right'>Right</b-radio>
            </p>
          </b-field>
          <b-field label='Title Transition'>
            <p class='control'>
              <b-radio v-model='titleTransition' native-value='none'>None</b-radio>
              <b-radio v-model='titleTransition' native-value='slide-h'>Horizontal Slide</b-radio>
              <b-radio v-model='titleTransition' native-value='slide-v'>Vertical Slide</b-radio>
              <b-radio v-model='titleTransition' native-value='fade'>Fade</b-radio>
            </p>
          </b-field>
          <b-field label='Weeks Transition'>
            <p class='control'>
              <b-radio v-model='weeksTransition' native-value='none'>None</b-radio>
              <b-radio v-model='weeksTransition' native-value='slide-h'>Horizontal Slide</b-radio>
              <b-radio v-model='weeksTransition' native-value='slide-v'>Vertical Slide</b-radio>
              <b-radio v-model='weeksTransition' native-value='fade'>Fade</b-radio>
            </p>
          </b-field>
          <br />
          <b-field>
            <p class='is-size-7'><strong>Note:</strong> Not all options available are displayed</p>
          </b-field>
        </b-tab-item>
      </b-tabs>
    </div>
    <div class='column'>
      <div class='example-container'>
        <v-calendar
          :is-double-paned='isDoublePaned'
          :is-linked='isLinked'
          :is-vertical='isVertical'
          :is-expanded='isExpanded'
          :nav-visibility='navVisibility'
          :title-position='titlePosition'
          :title-transition='titleTransition'
          :weeks-transition='weeksTransition'
          :theme-styles='themeStyles'
          :min-date='new Date()'>
        </v-calendar>
      </div>
    </div>
  </div>
</section>
</template>

<script>
export default {
  data() {
    return {
      isDoublePaned: true,
      isLinked: false,
      isVertical: false,
      isExpanded: false,
      navVisibility: 'focus',
      navVisibilities: ['focus', 'hover', 'visible', 'hidden'],
      titlePosition: 'center',
      titleTransition: 'slide-h',
      weeksTransition: 'slide-h',
      themeStyles: {
        // navHeaderTitle: {
        //   color: 'red',
        // },
        // navHeaderArrows: {
        //   color: 'blue',
        // },
        // weekdaysHorizontalDivider({ position }) {
        //   return (
        //     position === 2 && {
        //       borderBottom: '1px solid red',
        //       margin: '0 20px',
        //     }
        //   );
        // },
      },
    };
  },
};
</script>
