<template>
  <div class="vc-select">
    <select v-model="model" v-bind="$attrs">
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
        :disabled="option.disabled"
      >
        {{ option.label }}
      </option>
    </select>
    <div class="vc-select-arrow">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
        <path
          d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
        />
      </svg>
    </div>
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    options: Array,
    value: Number,
  },
  computed: {
    model: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      },
    },
  },
};
</script>

<style lang="postcss" scoped>
.vc-select {
  position: relative;
  & select {
    flex-grow: 1;
    display: block;
    appearance: none;
    width: 52px;
    height: 30px;
    font-size: var(--text-base);
    font-weight: var(--font-medium);
    text-align: left;
    background-color: var(--gray-200);
    border: 2px solid;
    border-color: var(--gray-200);
    color: var(--gray-900);
    padding: 0 20px 0 8px;
    border-radius: var(--rounded);
    line-height: var(--leading-tight);
    text-indent: 0px;
    cursor: pointer;
    -moz-padding-start: 3px;
    background-image: none;
    &:hover {
      color: var(--gray-600);
    }
    &:focus {
      outline: 0;
      border-color: var(--accent-400);
      background-color: var(--white);
    }
  }
}
.vc-select-arrow {
  display: flex;
  align-items: center;
  pointer-events: none;
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  padding: 0 4px 0 0;
  color: var(--gray-500);
  & svg {
    width: 16px;
    height: 16px;
    fill: currentColor;
  }
}
.vc-is-dark {
  & select {
    background: var(--gray-700);
    color: var(--gray-100);
    border-color: var(--gray-700);
    &:hover {
      color: var(--gray-400);
    }
    &:focus {
      border-color: var(--accent-500);
      background-color: var(--gray-800);
    }
  }
}
</style>
