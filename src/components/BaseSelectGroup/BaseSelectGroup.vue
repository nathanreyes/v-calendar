<template>
  <div class="vc-base-select-group" tabindex="0">
    <slot />
  </div>
</template>

<style lang="css">
.vc-base-select-group {
  display: inline-flex;
  align-items: center;
  height: 30px;
  padding: 0 4px;
  background: var(--vc-select-group-bg);
  border-radius: var(--vc-rounded-md);
  border: 1px solid var(--vc-select-group-hover-bg);
  &:hover {
    background-color: var(--vc-select-group-hover-bg);
  }
  &:focus-within {
    outline: 0;
    box-shadow: var(--vc-focus-ring);
  }
  .vc-base-icon {
    opacity: 0.5;
  }
}
</style>
