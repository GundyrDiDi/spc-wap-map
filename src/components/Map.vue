<template>
  <div id="map" ref="el">
  </div>
</template>

<script>
import 'ol/ol.css'
// import Map from 'ol/Map'
// import View from 'ol/View'

export default {
  name: 'Map',
  mounted () {
    this.map_init({ el: this.$refs.el })
  }
}
</script>

<style scoped>
  #map {
    height: 100px;
    background: red;
  }
</style>
