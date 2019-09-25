<template>
  <div class="example">
    <h3 class="text-lg mb-2">Mode</h3>
    <div class="flex mb-4">
      <div>
        <input type="radio" id="single" value="single" v-model="mode" />
        <label for="single">Single</label>
      </div>
      <div class="ml-2">
        <input type="radio" id="multiple" value="multiple" v-model="mode" />
        <label for="multiple">Multiple</label>
      </div>
      <div class="ml-2">
        <input type="radio" id="range" value="range" v-model="mode" />
        <label for="range">Range</label>
      </div>
    </div>
    <h3 class="text-lg mb-2">Popover Visibility</h3>
    <div class="flex mb-4">
      <div>
        <input
          type="radio"
          id="hover-focus"
          value="hover-focus"
          v-model="popover.visibility"
        />
        <label for="hover-focus">Hover Focus</label>
      </div>
      <div class="ml-2">
        <input
          type="radio"
          id="hover"
          value="hover"
          v-model="popover.visibility"
        />
        <label for="hover">Hover</label>
      </div>
      <div class="ml-2">
        <input
          type="radio"
          id="focus"
          value="focus"
          v-model="popover.visibility"
        />
        <label for="focus">Focus</label>
      </div>
      <div class="ml-2">
        <input
          type="radio"
          id="click"
          value="click"
          v-model="popover.visibility"
        />
        <label for="click">Click</label>
      </div>
      <div class="ml-2">
        <input
          type="radio"
          id="visible"
          value="visible"
          v-model="popover.visibility"
        />
        <label for="visible">Visible</label>
      </div>
    </div>
    <div class="flex items-center mb-2">
      <div>
        <input id="isInline" type="checkbox" v-model="isInline" class="mt-1" />
        <label for="isInline">Is Inline</label>
      </div>
      <div class="ml-2">
        <input id="isDark" type="checkbox" v-model="isDark" class="mt-1" />
        <label for="isDark">Is Dark</label>
      </div>
    </div>
    <div class="flex mb-2">
      <p>Popover Event Log: {{ popoverEvent }}</p>
    </div>
    <v-date-picker
      v-model="date"
      :mode="mode"
      :is-inline="isInline"
      :is-dark="isDark"
      :popover="popover"
      :attributes="attrs"
      @popoverWillShow="logPopoverEvent('popoverWillShow')"
      @popoverDidShow="logPopoverEvent('popoverDidShow')"
      @popoverWillHide="logPopoverEvent('popoverWillHide')"
      @popoverDidHide="logPopoverEvent('popoverDidHide')"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      date: { start: new Date(2019, 0, 5), end: new Date(2019, 0, 1) },
      mode: 'range',
      isInline: false,
      isDark: false,
      popover: {
        visibility: 'focus',
        placement: 'bottom-start',
      },
      popoverEvent: '',
      attrs: [
        {
          highlight: {
            color: 'gray',
            fillMode: 'none',
          },
          dates: new Date(),
        },
      ],
      dragAttribute: {
        highlight: {
          base: {
            fillMode: 'light',
          },
          startEnd: {
            fillMode: 'light',
          },
        },
      },
    };
  },
  methods: {
    logPopoverEvent(e) {
      this.popoverEvent = e;
    },
  },
};
</script>
