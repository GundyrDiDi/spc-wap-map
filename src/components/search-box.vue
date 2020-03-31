<template>
  <div @click="back">
    111111111
  </div>
</template>

<script>
export default {
  name: 'SearchBox',
  data () {
    return {}
  },
  methods: {
    async back () {
      this.$store.commit('login/isLogin', false)
      this._nameclass(['animated slideInLeft', 'animated slideOutRight'])
      this.$router.back()
    }
  }
}
</script>

<style>

</style>
