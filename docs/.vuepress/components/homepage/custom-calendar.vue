<template>
  <div class="text-center section">
    <h2 class="h2">Custom Calendars</h2>
    <p class="mb-6 text-lg font-medium text-gray-600">
      Roll your own calendars using scoped slots
    </p>
    <v-calendar
      class="max-w-full custom-calendar"
      :masks="masks"
      :attributes="attributes"
      disable-page-swipe
      is-expanded
    >
      <template v-slot:day-content="{ day, attributes }">
        <div class="z-10 flex flex-col h-full overflow-hidden">
          <span class="text-sm text-gray-900 day-label">{{ day.day }}</span>
          <div class="flex-grow overflow-y-auto"
            @drop="onDrop($event, day)"
            @dragover.prevent
            @dragenter.prevent
          >
            <div
              v-for="attr in attributes"
              :key="attr.key"
              class="p-1 mt-0 mb-1 text-xs leading-tight truncate rounded-sm cursor-pointer select-none"
              :class="attr.customData.class"
              :title="attr.customData.title"
              :draggable="true"
              @click="onClickEvent(attr)"
              @dragstart="startDrag($event, attr)"
            >
              {{ attr.customData.title }}
            </div>
          </div>
        </div>
      </template>
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
            class: 'bg-red-600 text-white',
          },
          dates: new Date(year, month, 1),
        },
        {
          key: 2,
          customData: {
            title: 'Take Noah to basketball practice',
            class: 'bg-blue-500 text-white',
          },
          dates: new Date(year, month, 2),
        },
        {
          key: 3,
          customData: {
            title: "Noah's basketball game.",
            class: 'bg-blue-500 text-white',
          },
          dates: new Date(year, month, 5),
        },
        {
          key: 4,
          customData: {
            title: 'Take car to the shop',
            class: 'bg-indigo-500 text-white',
          },
          dates: new Date(year, month, 5),
        },
        {
          key: 5,
          customData: {
            title: 'Meeting with new client.',
            class: 'bg-teal-500 text-white',
          },
          dates: new Date(year, month, 7),
        },
        {
          key: 6,
          customData: {
            title: "Mia's gymnastics practice.",
            class: 'bg-pink-500 text-white',
          },
          dates: new Date(year, month, 11),
        },
        {
          key: 7,
          customData: {
            title: 'Cookout with friends.',
            class: 'bg-orange-500 text-white',
          },
          dates: { months: 5, ordinalWeekdays: { 2: 1 } },
        },
        {
          key: 8,
          customData: {
            title: "Mia's gymnastics recital.",
            class: 'bg-pink-500 text-white',
          },
          dates: new Date(year, month, 22),
        },
        {
          key: 9,
          customData: {
            title: 'Visit great grandma.',
            class: 'bg-red-600 text-white',
          },
          dates: new Date(year, month, 25),
        },
      ],
    };
  },
  methods: {
    startDrag(evt, attr) {
      evt.dataTransfer.dropEffect = 'move'
      evt.dataTransfer.effectAllowed = 'move'
      evt.dataTransfer.setData('key', attr.key)
    },
    onDrop(evt, day) {
      const key = evt.dataTransfer.getData('key')
      let item = this.attributes.find(i => i.key === parseInt(key))
      item.dates = day.date
      this.attributes = [...this.attributes] // force calendar re-render
    },
    onClickEvent(attr) {
      alert(`click: ${attr.customData.title}`)
    }
  }
};
</script>

<style lang="postcss" scoped>
::-webkit-scrollbar {
  width: 0px;
}

::-webkit-scrollbar-track {
  display: none;
}

/deep/ .custom-calendar.vc-container {
  --day-border: 1px solid #b8c2cc;
  --day-border-highlight: 1px solid #b8c2cc;
  --day-width: 90px;
  --day-height: 90px;
  --weekday-bg: #f8fafc;
  --weekday-border: 1px solid #eaeaea;

  border-radius: 0;
  width: 100%;

  & .vc-header {
    background-color: #f1f5f8;
    padding: 10px 0;
  }
  & .vc-weeks {
    padding: 0;
  }
  & .vc-weekday {
    background-color: var(--weekday-bg);
    border-bottom: var(--weekday-border);
    border-top: var(--weekday-border);
    padding: 5px 0;
  }
  & .vc-day {
    padding: 0 5px 3px 5px;
    text-align: left;
    height: var(--day-height);
    min-width: var(--day-width);
    background-color: white;
    &.weekday-1,
    &.weekday-7 {
      background-color: #eff8ff;
    }
    &:not(.on-bottom) {
      border-bottom: var(--day-border);
      &.weekday-1 {
        border-bottom: var(--day-border-highlight);
      }
    }
    &:not(.on-right) {
      border-right: var(--day-border);
    }
  }
  & .vc-day-dots {
    margin-bottom: 5px;
  }
}
</style>
