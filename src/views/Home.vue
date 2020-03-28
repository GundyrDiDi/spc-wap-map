<template>
  <div id="home" ref="home">
    <ol-map />
  </div>
</template>

<script>
import olMap from '../components/olMap.vue'

export default {
  name: 'Home',
  components: {
    olMap
  },
  computed: {

  },
  mounted () {
    const h = window.innerHeight
    this.$refs.home.style.height = h + 'px'
    console.log(this.$refs.home.scrollHeight)
    window.onresize = () => {
      if (document.body.scrollHeight < h) {
        console.log(h)
        this.$refs.home.style.height = h + 'px'
      }
    }
  }
}

</script>

<style>

</style>
