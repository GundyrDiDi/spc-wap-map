<template>
  <transition :enter-active-class="[basic,enter[d]].join(' ')" :leave-active-class="[basic,leave[d]].join(' ')">
    <slot></slot>
  </transition>
</template>

<script>
export default {
  name: 'dy-transition',
  data () {
    return {
      basic: 'animated faster',
      d: 0
    }
  },
  watch: {
    ob (now, old) {
      if (now === this.i) {
        this.d = now - old > 0 ? 0 : 1
      } else {
        this.d = now - this.i > 0 ? 0 : 1
      }
    }
  },
  props: ['enter', 'leave', 'i', 'ob']
}
</script>

<style>

</style>
