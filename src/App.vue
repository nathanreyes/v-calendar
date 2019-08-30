<template>
    <div style="width: 400px;">
          <v-date-picker
          :value="value"
          is-inline
          :is-expanded="true"
          :disabled-dates="disabledDates"
          @input="changeMe"
          :mode="`range`"
          :min-date="new Date()"
          :attributes="[{key: 'today', highlight: { backgroundColor: '#eaeaea', }, dates: new Date()}]"
          :formats="{weekdays: 'WWW'}"
          :showDayPopover="false"
          tintColor="#ff9e16"
          show-caps
          ref="vuecal"
          @invalidrange="invalidRange"
          @disabledayclick="disabledayclick"
          >
            <template slot="header-left-button">
                <span>Left</span>
            </template>
            <template slot="header-right-button">
                <span>Right</span>
            </template>
          </v-date-picker>
    </div>
</template>
<script>
export default {
    data() { return {
        value: null,
        disabledDates: [
            {
                start: new Date('09-04-2019'),
                end: new Date('09-09-2019')
            }
        ]
    } },
    methods: {
        changeMe() {
            console.log('changing')
        },
        invalidRange() {
            alert('Invalid Date Range');
        },
        disabledayclick() {
            alert('disable day click');
        }
    },
    mounted() {
        console.log( this.$refs.vuecal )
    },
}
</script>