<template>
  <div id="app">
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
    console.log(this.$router)
  }
}

</script>

<style>
  html {
    position: relative;
    overflow: hidden;
    top: 0;
    left: 0;
    width: 100%;
    user-select: none;
    -webkit-user-select: none;
  }

  body {
    margin: 0;
    padding: 0;
    height: 100vh;
    font-family: 'Microsoft Yahei';
    position: relative;
    overflow: hidden;
    width: 100%;
  }

  :root {
    font-size: 18px;
  }

</style>
