<template>
  <v-date-picker
    ref="startAt"
    v-model="date"
    mode="dateTime"
    :popover="popover"
    :masks="masks"
  >
    <template #default="{ inputValue, inputEvents }">
      <div class="flex items-center" v-on="inputEvents">
        <input
          :value="inputValue"
          class="w-full px-6 py-3 placeholder-white bg-transparent border-0 outline-none md:text-tiny md:px-2 md:outline-none md:py-2 lg:px-6 lg:outline-none lg:py-3 ring-0"
          type="text"
          :readOnly="true"
          placeholder="Meetup Starts At"
        />
        <div class="flex items-center justify-center h-full px-6">
          <i class="far fa-calendar-alt" />
        </div>
      </div>
    </template>

    <template #footer>
      <div class="p-2 text-center bg-gray-100 border-t rounded-b-lg">
        <button
          class="px-2 py-1 font-medium text-white bg-blue-500 rounded hover:bg-blue-600"
          @click="hideAllCalendars"
        >
          Close
        </button>
      </div>
    </template>
  </v-date-picker>
</template>

<script>
export default {
  githubTitle:
    'how to hide v-date-picker in dateTime mode when clicking on button from footer?',
  data() {
    return {
      date: new Date(),
      popover: {},
      masks: {
        inputDateTime: 'YYYY-MM-DD HH:mm',
      },
    };
  },
  methods: {
    hideAllCalendars() {
      this.$refs.startAt.hidePopover();
    },
  },
};
</script>
