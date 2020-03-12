<template>
  <div id="app">
    <Map />
  </div>
</template>

<script>
import Map from './components/Map.vue'

export default {
  name: 'app',
  components: {
    Map
  },
  computed: {

  },
  mounted () {

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
