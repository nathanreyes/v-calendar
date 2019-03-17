<template>
  <div class="text-center section">
    <v-calendar class="custom-calendar" :masks="masks" :attributes="attributes">
      <div
        slot="day-content"
        slot-scope="{ day, attributes }"
        class="flex flex-col h-full z-10 overflow-hidden"
      >
        <span class="day-label text-sm text-grey-9">{{ day.day }}</span>
        <div class="flex-grow overflow-y-scroll overflow-x-auto">
          <p
            v-for="attr in attributes"
            class="text-xs leading-tight rounded-sm p-1 mt-0 mb-1"
            :class="attr.customData.class"
          >{{ attr.customData.title }}</p>
        </div>
      </div>
    </v-calendar>
  </div>
</template>

<script>
export default {
  data() {
    const month = new Date().getMonth();
    const year = new Date().getFullYear();
    return {
      masks: {
        weekdays: 'WWW',
      },
      attributes: [
        {
          key: 1,
          customData: {
            title: 'Lunch with mom.',
            class: 'bg-red-6 text-white',
          },
          dates: new Date(year, month, 1),
        },
        {
          key: 2,
          customData: {
            title: 'Take Noah to basketball practice',
            class: 'bg-blue-5 text-white',
          },
          dates: new Date(year, month, 2),
        },
        {
          key: 3,
          customData: {
            title: "Noah's basketball game.",
            class: 'bg-blue-5 text-white',
          },
          dates: new Date(year, month, 5),
        },
        {
          key: 4,
          customData: {
            title: 'Take car to the shop',
            class: 'bg-indigo text-white',
          },
          dates: new Date(year, month, 5),
        },
        {
          key: 4,
          customData: {
            title: 'Meeting with new client.',
            class: 'bg-teal-5 text-white',
          },
          dates: new Date(year, month, 7),
        },
        {
          key: 5,
          customData: {
            title: "Mia's gymnastics practice.",
            class: 'bg-pink-5 text-white',
          },
          dates: new Date(year, month, 11),
        },
        {
          key: 6,
          customData: {
            title: 'Cookout with friends.',
            class: 'bg-orange-5 text-white',
          },
          dates: { months: 5, ordinalWeekdays: { 2: 1 } },
        },
        {
          key: 7,
          customData: {
            title: "Mia's gymnastics recital.",
            class: 'bg-pink-5 text-white',
          },
          dates: new Date(year, month, 22),
        },
        {
          key: 8,
          customData: {
            title: 'Visit great grandma.',
            class: 'bg-red-6 text-white',
          },
          dates: new Date(year, month, 25),
        },
      ],
    };
  },
};
</script>

<style lang='sass' scoped>

$day-border: 1px solid #b8c2cc
$day-border-highlight: 1px solid #b8c2cc
$day-width: 100px
$day-height: 90px
$weekday-border: 1px solid #eaeaea

::-webkit-scrollbar
  width: 0px

::-webkit-scrollbar-track
  display: none

/deep/ .custom-calendar.vc-pane-container
  width: 100%
  .vc-header
    background-color: #f1f5f8
  .vc-weeks
    padding: 0
  .vc-weekdays
    background-color: #f8fafc
    border-bottom: $weekday-border
    border-top: $weekday-border
    padding: 5px 0
  .vc-day
    padding: 0 5px 3px 5px
    text-align: left
    height: $day-height
    min-width: $day-width
    background-color: white
    &.weekday-1, &.weekday-7
      background-color: #eff8ff
    &:not(.on-bottom)
      border-bottom: $day-border
      &.weekday-1
        border-bottom: $day-border-highlight
    &:not(.on-right)
      border-right: $day-border
  .vc-day-dots
    margin-bottom: 5px
</style>
