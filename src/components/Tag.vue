<template>
<span class='c-tag' @click.prevent='$emit("click")'>
  <slot></slot>
  <span class='c-delete' @click.prevent='$emit("delete")'></span>
</span>
</template>

<script>
export default {
  props: {
  },
};
</script>

<style lang='sass' scoped>

$borderColor: rgba(0, 0, 0, 0.1)
$backgroundColor: #fafafa

.c-tag:not(body)
  display: inline-flex
  align-items: center
  color: #3a3a3a
  cursor: pointer
  background-color: $backgroundColor
  border: solid 1px $borderColor
  border-radius: 5px
  font-size: 13px
  height: 2em
  justify-content: center
  line-height: 1.5
  padding-left: 0.75em
  padding-right: 0.75em
  white-space: nowrap
  transition: all 0.2s ease-in-out
  &:hover
    background-color: #eaeaea
  .c-delete
    margin-left: 0.25em
    margin-right: -0.375em
  &.is-delete
    margin-left: 1px
    padding: 0
    position: relative
    width: 2em
    &:before,
    &:after
      background-color: currentColor
      content: ""
      display: block
      left: 50%
      position: absolute
      top: 50%
      transform: translateX(-50%) translateY(-50%) rotate(45deg)
      transform-origin: center center
    &:before
      height: 1px
      width: 50%
    &:after
      height: 50%
      width: 1px
      &:hover,
      &:focus
        background-color: darken(red, 5%)
      &:active
        background-color: darken(red, 10%)
    &.is-rounded
      border-radius: 290486px


.c-delete
  line-height: 1.5
  cursor: pointer
  font-size: 1rem
  user-select: none
  background-color: rgba(10, 10, 10, 0.2)
  border: none
  border-radius: 290486px
  display: inline-block
  flex-grow: 0
  flex-shrink: 0
  width: 20px
  height: 20px
  max-height: 20px
  max-width: 20px
  min-height: 20px
  min-width: 20px
  outline: none;
  position: relative
  vertical-align: top
  &:before,
  &:after
    background-color: rgb(255, 255, 255)
    content: ""
    display: block
    left: 50%
    position: absolute
    top: 50%
    transform: translateX(-50%) translateY(-50%) rotate(45deg)
    transform-origin: center center
  &:before
    height: 2px
    width: 50%
  &:after
    height: 50%
    width: 2px
  &:hover,
  &:focus
    background-color: rgba(0, 0, 0, 0.4)

</style>